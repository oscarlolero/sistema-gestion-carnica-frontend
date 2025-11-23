export interface User {
  id: number
  name: string
  email?: string
  role?: string
  isActive: boolean
}

export interface CreateUserRequest {
  name: string
}
