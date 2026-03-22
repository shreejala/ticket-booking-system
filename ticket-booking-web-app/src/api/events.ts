import { endpooints } from "@/constants/endpoints"
import { api } from "@/lib/axios"
import type { EventResponse } from "@/types/event"

const { getEvents } = endpooints

export const fetchEvents = async (): Promise<EventResponse> => {
  const res = await api.get(getEvents)
  return res.data
}
