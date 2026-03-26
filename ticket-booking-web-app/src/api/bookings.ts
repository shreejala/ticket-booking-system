import { endpooints } from "@/constants/endpoints"
import { api } from "@/lib/axios"
import type { BookingPayloadRequest, BookingResponse } from "@/types/bookings"

const { bookEvent, getBookings } = endpooints

export const createBooking = async (payload: BookingPayloadRequest) => {
  const res = await api.post(bookEvent, payload)
  return res.data
}

export const fetchBookings = async (): Promise<BookingResponse> => {
  const res = await api.get(getBookings)
  return res.data
}
