import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  Check,
} from "typeorm";
import { Event } from "./Event";
import { Booking } from "./Booking";

export enum TicketTierName {
  VIP = "VIP",
  FRONT_ROW = "FRONT_ROW",
  GA = "GA",
}

@Entity()
@Check(`"availableQuantity" >= 0`)
@Check(`"totalQuantity" > 0`)
@Check(`"availableQuantity" <= "totalQuantity"`)
@Check(`"price" > 0`)
@Index(["event", "name"], { unique: true }) 
export class TicketTier {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: TicketTierName,
  })
  name: TicketTierName;

  @Column({ type: "decimal", precision: 10, scale: 2 })
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