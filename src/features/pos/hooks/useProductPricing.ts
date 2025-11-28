import { useState, useEffect } from 'react'
import type { ProductResponse } from '@/features/products/types'

type PricingInfo = {
  pricePerKg: number | null | undefined
  pricePerUnit: number | null | undefined
}

export const useProductPricing = (product: ProductResponse, selectedCut?: number) => {
  // Initialize unit based on available pricing from base product
  const getInitialUnit = (): 'kg' | 'pz' => {
    const hasKg = product.pricePerKg !== null && product.pricePerKg !== undefined
    const hasUnit = product.pricePerUnit !== null && product.pricePerUnit !== undefined

    if (hasKg && hasUnit) return 'kg' // default to kg if both available
    if (hasUnit) return 'pz' // prefer unit if only unit price exists
    if (hasKg) return 'kg'
    return 'pz' // fallback
  }

  const [selectedUnit, setSelectedUnit] = useState<'kg' | 'pz'>(getInitialUnit())

  // Get available pricing options based on selected cut or base product
  const getAvailablePricing = (): PricingInfo => {
    const hasCuts = product.cuts && product.cuts.length > 0

    if (hasCuts && selectedCut !== undefined) {
      const cut = product.cuts?.find((c) => c.cutId === selectedCut)
      return {
        pricePerKg: cut?.pricePerKg,
        pricePerUnit: cut?.pricePerUnit,
      }
    }
    return {
      pricePerKg: product.pricePerKg,
      pricePerUnit: product.pricePerUnit,
    }
  }

  const pricing = getAvailablePricing()
  const hasKgPrice = pricing.pricePerKg !== null && pricing.pricePerKg !== undefined
  const hasUnitPrice = pricing.pricePerUnit !== null && pricing.pricePerUnit !== undefined
  const hasBothPrices = hasKgPrice && hasUnitPrice

  // Get current price based on selected unit
  const getCurrentPrice = () => {
    const rawPrice = selectedUnit === 'kg' ? pricing.pricePerKg : pricing.pricePerUnit
    const numPrice = typeof rawPrice === 'string' ? Number(rawPrice) : (rawPrice ?? 0)
    return numPrice && !isNaN(numPrice) ? numPrice : 0
  }

  const price = getCurrentPrice()

  // Update unit selection when pricing changes
  useEffect(() => {
    if (hasKgPrice && !hasUnitPrice) {
      setSelectedUnit('kg')
    } else if (hasUnitPrice && !hasKgPrice) {
      setSelectedUnit('pz')
    }
  }, [hasKgPrice, hasUnitPrice])

  return {
    selectedUnit,
    setSelectedUnit,
    price,
    hasKgPrice,
    hasUnitPrice,
    hasBothPrices,
  }
}
