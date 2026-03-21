import "reflect-metadata";
import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Event } from "./entity/Event";
import { Booking } from "./entity/Booking";
import { TicketTier } from "./entity/TicketTier";

dotenv.config();

const { DB_HOST, DB_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } =
  process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: DB_PORT ? JSON.parse(DB_PORT) : 5432,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB || 'ticketdb',
  synchronize: false,
  entities: [Event, TicketTier, Booking],
  migrations: ["src/migrations/*.ts"],
  logging: true,
});
