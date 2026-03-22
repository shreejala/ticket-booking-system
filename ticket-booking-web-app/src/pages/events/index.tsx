import type { BookingPayloadRequest } from "@/types/bookings"
import { EventTable } from "./EventsTable"
import { useEvents } from "@/api-hooks/useEvents"
import { useCreateBooking } from "@/api-hooks/useBookings"
import { useState } from "react"
import { ThemedAlert } from "@/components/themed-alert"
import { BookingSuccessDialog } from "./BookingSuccessDialog"

export const EventDashboard = () => {
  const { data } = useEvents()
  const {
    mutateAsync,
    isPending,
    error,
    data: bookingData,
  } = useCreateBooking()

  const [processStatus, setProcessStatus] = useState<null | string>(null)
  const [successOpen, setSuccessOpen] = useState(false)

  const handleBookingPress = async (data: BookingPayloadRequest) => {
    try {
      await mutateAsync(data)
      setProcessStatus("success")
      setSuccessOpen(true)
    } catch (err: unknown) {
      console.error("Error creating booking:", err)
      setProcessStatus("failure")
    }
  }
  
  return (
    <div className="w-full">
      <h1>Upcoming Events</h1>

      <div className="mt-6">
        <EventTable
          data={data?.data || []}
          onBookingPress={handleBookingPress}
          isBookingLoading={isPending}
          processStatus={processStatus}
        />
      </div>

      {error && (
        <ThemedAlert
          title="Oops! Something went wrong."
          message={
            error?.message || "Failed to book ticket. Please try again later."
          }
          type="error"
        />
      )}

      <BookingSuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        data={bookingData?.data || null}
      />
    </div>
  )
}
