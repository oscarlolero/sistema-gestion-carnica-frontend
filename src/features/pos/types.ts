export interface CartItem {
  id: string // Unique cart item ID (productId-cutId-unit or productId-unit)
  productId: number
  productName: string
  cutId?: number
  cutName?: string
  quantity: number
  unitPrice: number
  subtotal: number
  unit: 'kg' | 'ud' // Unit type: kg or unidad
}

export interface PosProduct {
  id: number
  name: string
  pricePerKg: number | null
  pricePerUnit: number | null
  baseUnit: {
    id: number
    name: string
    abbreviation: string
  }
  categories: Array<{
    id: number
    name: string
  }>
  cuts: Array<{
    id: number
    name: string
    pricePerKg: number | null
    pricePerUnit: number | null
  }>
}

export type PaymentType = 'cash' | 'card' | 'transfer'

export const paymentTypeLabels: Record<PaymentType, string> = {
  cash: 'Efectivo',
  card: 'Tarjeta',
  transfer: 'Transferencia',
}
