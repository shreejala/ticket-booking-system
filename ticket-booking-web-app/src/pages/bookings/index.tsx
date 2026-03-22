import { useBookings } from "@/api-hooks/useBookings"
import { BookingsTable } from "./BookingTable"

export const MyBookings = () => {
  const { data } = useBookings()

  return (
    <div className="w-full">
      <h1>Upcoming Events</h1>

      <div className="mt-6">
        <BookingsTable data={data?.data || []} />
      </div>
    </div>
  )
}
