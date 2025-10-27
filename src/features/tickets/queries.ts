import {
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket,
  type TicketListParams,
} from '@/api/modules/tickets.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UpdateTicketDto } from './types'

const TICKETS_KEY = 'tickets'

export const useTickets = (params: TicketListParams = { page: 1, limit: 10 }) =>
  useQuery({
    queryKey: [TICKETS_KEY, params],
    queryFn: () => getTickets(params),
  })

export const useTicket = (id: number) =>
  useQuery({
    queryKey: [TICKETS_KEY, id],
    queryFn: () => getTicket(id),
  })

export const useUpdateTicket = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateTicketDto }) => updateTicket(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY] })
    },
  })
}

export const useDeleteTicket = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY] })
    },
  })
}
