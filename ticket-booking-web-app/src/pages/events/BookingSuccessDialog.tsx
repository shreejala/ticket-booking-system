import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import type { Booking } from "@/types/bookings"
import { Separator } from "@/components/ui/separator"
import { TicketTiers } from "@/constants/ticket-tier"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: Booking | null
}

export function BookingSuccessDialog({ open, onOpenChange, data }: Props) {
  if (!data) return null

  console.log("shreejala data", data)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <DialogTitle>Booking Successful</DialogTitle>
          </div>
          <Separator />
        </DialogHeader>

        <div className="mt-2 space-y-4 text-sm">
          <div>
            <p className="text-muted-foreground">Booking ID</p>
            <p className="font-medium">{data.bookingId}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Ticket Type</p>
            <p className="font-medium">
              {TicketTiers[data.ticketTier.name] || ""}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Event</p>
            <p className="font-medium">{data.event.name}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Venue</p>
            <p className="font-medium">{data.event.venue}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Event Date</p>
            <p className="font-medium">
              {new Date(data.event.eventDate).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Quantity</p>
            <p className="font-medium">{data.quantity}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Total price</p>
            <p className="font-medium">${data.totalAmount}</p>
          </div>
        </div>

        <Button className="mt-4 w-full" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  )
}
