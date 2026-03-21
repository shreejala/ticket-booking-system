import { Router } from "express";
import { getEventById, getEvents, seedBulkEvents } from "../controllers/event.controller";

const router = Router();

router.post("/seed-events", seedBulkEvents);
router.get("/events", getEvents);
router.get("/events/:id", getEventById);

export default router;