import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { TicketTiers } from "@/constants/ticket-tier"
import type { Event, TicketTier } from "@/types/event"
import type { BookingPayloadRequest } from "@/types/bookings"
import { emailRegex } from "@/constants/regex"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: Event | null
  onBookingPress: (data: BookingPayloadRequest) => void
  isBookingLoading: boolean
  processStatus: string | null
}

type FormValues = {
  tier: string
  quantity: number
  email: string
}

export function EventDetailsDialog({
  open,
  onOpenChange,
  event,
  onBookingPress,
  isBookingLoading,
  processStatus,
}: Props) {
  useEffect(() => {
    if (processStatus !== null) {
      handleOnToogleDialogue(false)
    }
  }, [processStatus])

  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null)

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>()

  const quantity = watch("quantity")

  if (!event) return null

  const onSubmit = (data: FormValues) => {
    if (!selectedTier) return

    if (data.quantity > selectedTier.availableQuantity) {
      alert("Quantity exceeds available tickets")
      return
    }
    const payload = {
      eventId: event.id,
      ticketTierId: selectedTier.id,
      quantity: data.quantity,
      userEmail: data.email,
    }
    onBookingPress(payload)
  }

  const handleTicketTypeChange = (value: string) => {
    setValue("tier", value)
    const tier = event.ticketTiers.find((t) => t.id === value)
    setSelectedTier(tier || null)
  }

  const handleOnToogleDialogue = (open: boolean) => {
    onOpenChange(open)

    if (!open) {
      setSelectedTier(null)
      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOnToogleDialogue}>
      <DialogContent className="p-6 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Book Tickets</DialogTitle>
          <Separator />
        </DialogHeader>

        <div className="space-y-1 text-sm">
          <p className="font-semibold">{event.name}</p>
          <p className="text-muted-foreground">{event.venue}</p>
          <p className="text-muted-foreground">
            {new Date(event.eventDate).toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm">Email</label>

            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: emailRegex,
                  message: "Invalid email address",
                },
              })}
            />

            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm">Ticket Type</label>

            <Select onValueChange={handleTicketTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Ticket Type" />
              </SelectTrigger>

              <SelectContent>
                {event.ticketTiers.map((tier) => (
                  <SelectItem key={tier.name} value={tier.id}>
                    {TicketTiers[tier.name]} (${tier.price})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm">No. of Tickets</label>

            <Input
              type="number"
              min={1}
              max={selectedTier?.availableQuantity || 1}
              {...register("quantity", {
                required: true,
                valueAsNumber: true,
                validate: (value) =>
                  !selectedTier ||
                  value <= selectedTier.availableQuantity ||
                  "Exceeds available tickets",
              })}
              placeholder="Eg: 1"
            />

            {errors.quantity && (
              <p className="text-sm text-destructive">
                {errors.quantity.message}
              </p>
            )}
          </div>

          <div className="flex justify-between text-sm">
            <span>Total Price:</span>
            <span className="font-semibold">
              $
              {selectedTier?.price && quantity
                ? (selectedTier.price * quantity).toFixed(2)
                : "0.00"}
            </span>
          </div>

          <Button type="submit" className="w-full" disabled={isBookingLoading}>
            {isBookingLoading ? "Processing..." : "Confirm Booking"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
