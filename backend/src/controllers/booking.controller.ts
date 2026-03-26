import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Event } from "../entity/Event";
import { TicketTier } from "../entity/TicketTier";
import { Booking, BookingStatus } from "../entity/Booking";
import { isValidEmail } from "../utils/helper";

interface BookingQuery {
  email?: string;
}

interface BookingBody {
  eventId: string;
  ticketTierId: string;
  quantity: number;
  userEmail: string;
}

export const bookTicket = async (req: Request<{}, {}, BookingBody>, res: Response) => {
  const { eventId, ticketTierId, quantity, userEmail } = req.body;

  // validate before updating for bookings and ticket tier quantity
  if (!userEmail || !isValidEmail(userEmail)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  if (!eventId || !ticketTierId) {
    return res.status(400).json({ message: "eventId and ticketTierId are required" });
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const event = await queryRunner.manager.findOne(Event, {
      where: { id: eventId },
    });

    if (!event) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({ message: "Event not found" });
    }

    if (new Date() > new Date(event.eventDate)) {
      await queryRunner.rollbackTransaction();
      return res.status(400).json({ message: "Event has already passed" });
    }

    // pessimistic_write on ticket tier to block concurrent requests
    // This blocks other transactions from reading or writing the same ticket tier until the current transaction is completed, ensuring that the available quantity is accurately updated.
    const ticketTier = await queryRunner.manager.findOne(TicketTier, {
      where: { id: ticketTierId, event: { id: eventId } },
      lock: { mode: "pessimistic_write" },
    });

    if (!ticketTier) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({ message: "Ticket tier not found for this event" });
    }

    // check ticket availability
    if (ticketTier.availableQuantity === 0) {
      await queryRunner.rollbackTransaction();
      return res.status(400).json({ message: `${ticketTier.name} tickets are sold out` });
    }

    if (ticketTier.availableQuantity < quantity) {
      await queryRunner.rollbackTransaction();
      return res.status(400).json({
        message: `Only ${ticketTier.availableQuantity} ${ticketTier.name} tickets remaining`,
      });
    }

    // decrement of available quantity with verification to check final race condition
    const updated = await queryRunner.manager
      .createQueryBuilder()
      .update(TicketTier)
      .set({ availableQuantity: () => `"availableQuantity" - ${quantity}` })
      .where("id = :id AND \"availableQuantity\" >= :quantity", {
        id: ticketTierId,
        quantity,
      })
      .execute();

    if (updated.affected === 0) {
      await queryRunner.rollbackTransaction();
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    // creating a booking row
    const booking = queryRunner.manager.create(Booking, {
      userEmail: userEmail.trim().toLowerCase(),
      quantity,
      totalAmount: Number(ticketTier.price) * quantity,
      status: BookingStatus.SUCCESS,
      event: { id: eventId },
      ticketTier: { id: ticketTierId },
    });

    const savedBooking = await queryRunner.manager.save(Booking, booking);
    await queryRunner.commitTransaction();

    return res.status(201).json({
      message: "Booking successful",
      data: {
        bookingId: savedBooking.id,
        userEmail: savedBooking.userEmail,
        event: {
          id: event.id,
          name: event.name,
          venue: event.venue,
          eventDate: event.eventDate,
        },
        ticketTier: {
          id: ticketTier.id,
          name: ticketTier.name,
          price: Number(ticketTier.price),
        },
        quantity: savedBooking.quantity,
        totalAmount: savedBooking.totalAmount,
        status: savedBooking.status,
        bookedAt: savedBooking.createdAt,
      },
    });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export const getBookings = async (req: Request<{}, {}, {}, BookingQuery>, res: Response) => {
  const { email } = req.query;

  if (email && !isValidEmail(email as string)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  const bookingRepo = AppDataSource.getRepository(Booking);

  const query = bookingRepo
    .createQueryBuilder("booking")
    .leftJoinAndSelect("booking.event", "event")
    .leftJoinAndSelect("booking.ticketTier", "ticketTier")
    .orderBy("booking.createdAt", "DESC");

  if (email) {
    query.where("booking.userEmail = :email", {
      email: (email as string).trim().toLowerCase(),
    });
  }

  const bookings = await query.getMany();

  if (bookings.length === 0) {
    return res.status(404).json({ message: "No bookings found" });
  }

  const data = bookings.map((booking) => ({
    bookingId: booking.id,
    userEmail: booking.userEmail,
    status: booking.status,
    quantity: booking.quantity,
    totalAmount: Number(booking.totalAmount),
    bookedAt: booking.createdAt,
    event: {
      id: booking.event.id,
      name: booking.event.name,
      venue: booking.event.venue,
      eventDate: booking.event.eventDate,
    },
    ticketTier: {
      id: booking.ticketTier.id,
      name: booking.ticketTier.name,
      price: Number(booking.ticketTier.price),
    },
  }));

  return res.status(200).json({
    count: data.length,
    data,
  });
};