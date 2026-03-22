import { Router } from "express";
import { bookTicket, getBookings } from "../controllers/booking.controller";

const router = Router();

router.post("/book-ticket", bookTicket);
router.get("/get-bookings", getBookings);

export default router;
