import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from "typeorm";
import { TicketTier } from "./TicketTier";

@Entity()
@Index(["name", "venue"])
@Index(["eventDate"])
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255 })
  venue: string;
  
  @Column({ type: "timestamp" })
  eventDate: Date;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @OneToMany(() => TicketTier, (ticketTier) => ticketTier.event)
  ticketTiers: TicketTier[];
}