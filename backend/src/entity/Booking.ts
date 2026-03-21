import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Event } from "./Event";
import { TicketTier } from "./TicketTier";

export enum BookingStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  PENDING = "PENDING",
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userEmail: string

  @Column({ type: "int" })
  quantity: number;
  
  @Column({
    type: "enum",
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => Event, {
    onDelete: "CASCADE",
  })
  event: Event;
  
  @ManyToOne(() => TicketTier, (ticketTier) => ticketTier.bookings, {
    onDelete: "CASCADE",
  })
  ticketTier: TicketTier;
}