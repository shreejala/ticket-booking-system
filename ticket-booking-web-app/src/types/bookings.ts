export interface BookingPayloadRequest {
  eventId: string;
  ticketTierId: string;
  quantity: number;
  userEmail: string;
}

export interface BookingResponse {
  count: number
  data: Booking[]
}

export interface Booking {
  bookingId: string
  userEmail: string
  status: string
  quantity: number
  totalAmount: number
  bookedAt: string
  event: Event
  ticketTier: TicketTier
}

export interface Event {
  id: string
  name: string
  venue: string
  eventDate: string
}

export interface TicketTier {
  id: string
  name: string
  price: number
}


export interface BookingConfirmResponse {
  message: string
  data: Booking
}
