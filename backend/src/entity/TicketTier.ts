import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Event } from "./Event";
import { Booking } from "./Booking";

export enum TicketTierName {
  VIP = "VIP",
  FRONT_ROW = "FRONT_ROW",
  GA = "GA",
}

@Entity()
export class TicketTier {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: TicketTierName,
  })
  name: TicketTierName;

  @Column({ type: "decimal" })
  price: number;

  @Column({ type: "int" })
  totalQuantity: number;

  @Column({ type: "int" })
  availableQuantity: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => Event, (event) => event.ticketTiers, {
    onDelete: "CASCADE",
  })
  event: Event;

  @OneToMany(() => Booking, (booking) => booking.ticketTier)
  bookings: Booking[];
}
