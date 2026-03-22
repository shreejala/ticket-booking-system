export interface EventResponse {
  count: number
  data: Event[]
}

export interface Event {
  id: string
  name: string
  venue: string
  eventDate: string
  ticketTiers: TicketTier[]
  totalTickets: number
  totalAvailable: number
  isSoldOut: boolean
}

export interface TicketTier {
  id: string
  name: string
  price: number
  totalQuantity: number
  availableQuantity: number
  isSoldOut: boolean
}
