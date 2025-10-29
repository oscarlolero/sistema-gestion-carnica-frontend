export interface TicketResponse {
  id: number
  date: string
  total: number
  paymentType: string
  userId: number | null
  printed: boolean
  createdAt: string
  updatedAt: string
  items: Array<{
    id: number
    productId: number
    cutId: number | null
    quantity: number
    unitPrice: number
    subtotal: number
    unit: 'kg' | 'pz'
    product: {
      id: number
      name: string
    }
    cut: {
      id: number
      name: string
    } | null
  }>
  user: {
    id: number
    name: string
    email: string | null
  } | null
}

export interface CreateTicketDto {
  date?: string | Date
  total: number
  paymentType: string
  userId?: number
  printed?: boolean
  items: Array<{
    productId: number
    cutId?: number
    quantity: number
    unitPrice: number
    subtotal: number
    unit: 'kg' | 'pz'
  }>
}

export interface UpdateTicketDto {
  date?: string | Date
  total?: number
  paymentType?: string
  userId?: number
  printed?: boolean
  items?: Array<{
    productId: number
    cutId?: number
    quantity: number
    unitPrice: number
    subtotal: number
  }>
}

export interface DailySummaryResponse {
  date: string
  totalSales: number
  totalTickets: number
  items: Array<{
    productName: string
    cutName: string | null
    quantity: number
    unit: string
    totalAmount: number
  }>
}
