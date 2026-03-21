import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  Check,
} from "typeorm";
import { Event } from "./Event";
import { TicketTier } from "./TicketTier";

export enum BookingStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  PENDING = "PENDING",
}

@Entity()
@Check(`"quantity" > 0`)
@Check(`"totalAmount" > 0`)
@Index(["userEmail", "event"])
@Index(["ticketTier", "status"])
export class Booking {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ type: "varchar", length: 255 })
  userEmail: string;

  @Column({ type: "int" })
  quantity: number;
  
  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalAmount: number;

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
