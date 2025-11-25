import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { client as api } from '@/api/client'
import type { Client } from './types'

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data } = await api.get<Client[]>('/clients')
      return data
    },
  })
}

export const useCreateClient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newClient: { name: string }) => {
      const { data } = await api.post<Client>('/clients', newClient)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}
