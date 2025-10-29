import { client } from '../client'
import type {
  TicketResponse,
  CreateTicketDto,
  UpdateTicketDto,
  DailySummaryResponse,
} from '@/features/tickets/types'
import type { PaginatedResponse, SortOrder } from '@/types'

export interface TicketListParams {
  page?: number
  limit?: number
  search?: string
  userId?: number
  startDate?: string
  endDate?: string
  sortBy?: 'date' | 'createdAt' | 'updatedAt' | 'total'
  order?: SortOrder
}

export type TicketListResponse = PaginatedResponse<TicketResponse>

export const getTickets = async (
  params: TicketListParams = { page: 1, limit: 10 },
): Promise<TicketListResponse> => {
  const { page = 1, limit = 10, search, sortBy, order, userId, startDate, endDate } = params

  const searchParam = search ? `&search=${encodeURIComponent(search)}` : ''
  const sortParam = sortBy ? `&sortBy=${sortBy}` : ''
  const orderParam = order ? `&order=${order}` : ''
  const userIdParam = userId ? `&userId=${userId}` : ''
  const startDateParam = startDate ? `&startDate=${encodeURIComponent(startDate)}` : ''
  const endDateParam = endDate ? `&endDate=${encodeURIComponent(endDate)}` : ''

  const res = await client.get(
    `/tickets?page=${page}&limit=${limit}${searchParam}${sortParam}${orderParam}${userIdParam}${startDateParam}${endDateParam}`,
  )
  return res.data
}

export const getTicket = async (id: number): Promise<TicketResponse> => {
  const res = await client.get(`/tickets/${id}`)
  return res.data
}

export const createTicket = async (data: CreateTicketDto): Promise<TicketResponse> => {
  const res = await client.post('/tickets', data)
  return res.data
}

export const updateTicket = async (id: number, data: UpdateTicketDto): Promise<TicketResponse> => {
  const res = await client.patch(`/tickets/${id}`, data)
  return res.data
}

export const deleteTicket = async (id: number): Promise<TicketResponse> => {
  const res = await client.delete(`/tickets/${id}`)
  return res.data
}

export const getDailySummary = async (date?: string): Promise<DailySummaryResponse> => {
  const dateParam = date ? `?date=${encodeURIComponent(date)}` : ''
  const res = await client.get(`/tickets/summary/daily${dateParam}`)
  return res.data
}
