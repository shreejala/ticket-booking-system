import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TicketTier, TicketTierName } from "../entity/TicketTier";
import { Event } from "../entity/Event";

interface TicketTierInput {
  name: TicketTierName;
  price: number;
  totalQuantity: number;
}

interface EventInput {
  name: string;
  venue: string;
  eventDate: string;
  ticketTiers: TicketTierInput[];
}

export const seedBulkEvents = async (req: Request, res: Response) => {
  const { events }: { events: EventInput[] } = req.body;

  if (!Array.isArray(events) || events.length === 0) {
    return res.status(400).json({ message: "Events must be provided." });
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const keys = events.map((e) => `${e.name}::${e.venue}`);
    const uniqueKeys = new Set(keys);

    if (uniqueKeys.size !== events.length) {
      return res
        .status(400)
        .json({
          message:
            "Duplicate events in the request. Please check and try again.",
        });
    }

    const existingEvents: Event[] = await queryRunner.manager
      .createQueryBuilder(Event, "event")
      .where(
        events
          .map(
            (_, i) => `(event.name = :name${i} AND event.venue = :venue${i})`,
          )
          .join(" OR "),
        events.reduce(
          (params, event, i) => ({
            ...params,
            [`name${i}`]: event.name,
            [`venue${i}`]: event.venue,
          }),
          {},
        ),
      )
      .getMany();

    if (existingEvents.length > 0) {
      await queryRunner.rollbackTransaction();
      return res.status(409).json({
        message: "Some events already exist.",
        conflicts: existingEvents.map((e) => ({
          name: e.name,
          venue: e.venue,
        })),
      });
    }

    const eventEntities = events.map((e) =>
      queryRunner.manager.create(Event, {
        name: e.name,
        venue: e.venue,
        eventDate: new Date(e.eventDate),
      }),
    );

    const savedEvents = await queryRunner.manager.save(Event, eventEntities, {
      chunk: 100,
    });

    const tierEntities = savedEvents.flatMap((savedEvent, i) =>
      events[i].ticketTiers.map((tier) =>
        queryRunner.manager.create(TicketTier, {
          name: tier.name,
          price: tier.price,
          totalQuantity: tier.totalQuantity,
          availableQuantity: tier.totalQuantity,
          event: savedEvent,
        }),
      ),
    );

    await queryRunner.manager.save(TicketTier, tierEntities, {
      chunk: 300,
    });

    await queryRunner.commitTransaction();

    return res.status(201).json({
      message: `${savedEvents.length} events seeded successfully`,
    });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export const getEvents = async (req: Request, res: Response) => {
  const eventRepo = AppDataSource.getRepository(Event);

  const events = await eventRepo
    .createQueryBuilder("event")
    .leftJoinAndSelect("event.ticketTiers", "ticketTier")
    .orderBy("event.eventDate", "ASC")
    .addOrderBy("ticketTier.price", "ASC")
    .getMany();

  const data = events.map((event) => ({
    id: event.id,
    name: event.name,
    venue: event.venue,
    eventDate: event.eventDate,
    ticketTiers: event.ticketTiers.map((tier) => ({
      id: tier.id,
      name: tier.name,
      price: Number(tier.price),
      totalQuantity: tier.totalQuantity,
      availableQuantity: tier.availableQuantity,
      isSoldOut: tier.availableQuantity === 0,
    })),
    totalTickets: event.ticketTiers.reduce(
      (sum, tier) => sum + tier.totalQuantity,
      0,
    ),
    totalAvailable: event.ticketTiers.reduce(
      (sum, tier) => sum + tier.availableQuantity,
      0,
    ),
    isSoldOut: event.ticketTiers.every((tier) => tier.availableQuantity === 0),
  }));

  return res.status(200).json({
    count: data.length,
    data,
  });
};

export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const eventRepo = AppDataSource.getRepository(Event);

  const event = await eventRepo
    .createQueryBuilder("event")
    .leftJoinAndSelect("event.ticketTiers", "ticketTier")
    .where("event.id = :id", { id })
    .addOrderBy("ticketTier.price", "ASC")
    .getOne();

  if (!event) {
    return res.status(404).json({ message: "Event not found." });
  }

  const data = {
    id: event.id,
    name: event.name,
    venue: event.venue,
    eventDate: event.eventDate,
    ticketTiers: event.ticketTiers.map((tier) => ({
      id: tier.id,
      name: tier.name,
      price: Number(tier.price),
      totalQuantity: tier.totalQuantity,
      availableQuantity: tier.availableQuantity,
      soldQuantity: tier.totalQuantity - tier.availableQuantity,
      isSoldOut: tier.availableQuantity === 0,
    })),
    totalTickets: event.ticketTiers.reduce(
      (sum, tier) => sum + tier.totalQuantity,
      0,
    ),
    totalAvailable: event.ticketTiers.reduce(
      (sum, tier) => sum + tier.availableQuantity,
      0,
    ),
    totalSold: event.ticketTiers.reduce(
      (sum, tier) => sum + (tier.totalQuantity - tier.availableQuantity),
      0,
    ),
    isSoldOut: event.ticketTiers.every((tier) => tier.availableQuantity === 0),
  };

  return res.status(200).json({ data });
};
