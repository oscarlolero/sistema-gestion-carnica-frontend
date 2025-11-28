import { useState } from 'react'
import type { CartItem, PaymentType } from '../types'
import type { ProductResponse } from '@/features/products/types'

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentType, setPaymentType] = useState<PaymentType>('cash')
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null)

  const handleAddToCart = (
    product: ProductResponse,
    cutId?: number,
    unit?: 'kg' | 'pz',
    quantityToAdd?: number,
  ) => {
    const cut = cutId ? product.cuts?.find((c) => c.cutId === cutId) : undefined

    // Get price based on selected unit
    const selectedUnit = unit ?? 'kg'
    const rawPrice = cut
      ? (selectedUnit === 'kg' ? cut.pricePerKg : cut.pricePerUnit) ?? 0
      : (selectedUnit === 'kg' ? product.pricePerKg : product.pricePerUnit) ?? 0
    const unitPrice = typeof rawPrice === 'string' ? Number(rawPrice) : (rawPrice ?? 0)

    // Create unique cart item ID including unit
    const cartItemId = cutId ? `${product.id}-${cutId}-${selectedUnit}` : `${product.id}-${selectedUnit}`

    const addQuantity = quantityToAdd ?? 1

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === cartItemId)

      if (existingItem) {
        // Add quantity
        return prevCart.map((item) =>
          item.id === cartItemId
            ? {
                ...item,
                quantity: item.quantity + addQuantity,
                subtotal: (item.quantity + addQuantity) * item.unitPrice,
              }
            : item,
        )
      }

      // Add new item
      const cutName = cutId ? (cut?.cut?.name ?? `Corte #${cutId}`) : undefined

      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        productName: product.name,
        cutId,
        cutName,
        quantity: addQuantity,
        unitPrice,
        subtotal: addQuantity * unitPrice,
        unit: selectedUnit,
      }

      return [...prevCart, newItem]
    })
  }

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity, subtotal: quantity * item.unitPrice } : item,
        ),
      )
    }
  }

  const handleRemoveItem = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
  }

  const handleClearCart = () => {
    setCart([])
    setSelectedUserId(null)
    setSelectedClientId(null)
  }

  return {
    cart,
    paymentType,
    setPaymentType,
    selectedUserId,
    setSelectedUserId,
    selectedClientId,
    setSelectedClientId,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
  }
}
