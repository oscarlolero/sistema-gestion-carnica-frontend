import { client } from '../client'
import type { User, CreateUserRequest } from '@/features/users/types'

export const getUsers = async (): Promise<User[]> => {
  const res = await client.get('/users')
  return res.data
}

export const createUser = async (data: CreateUserRequest): Promise<User> => {
  const res = await client.post('/users', data)
  return res.data
}
