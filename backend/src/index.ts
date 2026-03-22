import express from "express";
import { AppDataSource } from "./data-source";
import eventRoutes from "./routes/event.routes";
import bookingRoutes from "./routes/booking.routes";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.use("/api/event-service", eventRoutes);
app.use("/api/booking-service", bookingRoutes);

AppDataSource.initialize()
  .then(async () => {
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((error) => console.log("this is error", error));

export default app;
