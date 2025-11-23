import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers, createUser } from '@/api/modules/users.api'
import type { CreateUserRequest } from './types'

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userData: CreateUserRequest) => createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
