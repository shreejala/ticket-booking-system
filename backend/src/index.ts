import express from "express";
import { AppDataSource } from "./data-source";
import eventRoutes from "./routes/event.routes";

const app = express();
app.use(express.json());

app.use("/api/event-service", eventRoutes);

AppDataSource.initialize()
  .then(async () => {
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((error) => console.log("this is error", error));

export default app;