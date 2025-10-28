import { useState } from 'react'
import type { ProductResponse } from '@/features/products/types'

type PosProductCardProps = {
  product: ProductResponse
  onAdd: (product: ProductResponse, cutId?: number) => void
}

export const PosProductCard = ({ product, onAdd }: PosProductCardProps) => {
  const [selectedCut, setSelectedCut] = useState<number | undefined>(undefined)
  const hasCuts = product.cuts && product.cuts.length > 0

  // Get price based on selected cut or base product
  const getPrice = () => {
    let rawPrice: number | null = 0

    if (hasCuts && selectedCut !== undefined) {
      const cut = product.cuts?.find((c) => c.cutId === selectedCut)
      rawPrice = cut?.pricePerKg ?? cut?.pricePerUnit ?? 0
    } else {
      rawPrice = product.pricePerKg ?? product.pricePerUnit ?? 0
    }

    const numPrice = typeof rawPrice === 'string' ? Number(rawPrice) : rawPrice
    return numPrice && !isNaN(numPrice) ? numPrice : 0
  }

  const price = getPrice()
  const priceLabel = product.pricePerKg ? 'Por kg' : 'Por unidad'

  const handleAdd = () => {
    onAdd(product, hasCuts ? selectedCut : undefined)
  }

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[#fef9f4] to-[#f7f0e6]">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#b22222]/20">{product.name.charAt(0)}</div>
          </div>
        </div>
        {!product.isActive && (
          <span className="absolute right-3 top-3 rounded-full bg-gray-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            Inactivo
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#2d2d2d]">{product.name}</h3>
            <p className="text-sm text-[#8c8c8c]">{priceLabel}</p>
          </div>
          <span className="rounded-full bg-[#fdf0ed] px-3 py-1 text-sm font-semibold text-[#b22222]">
            ${price.toFixed(2)}
          </span>
        </div>

        {hasCuts && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#8c8c8c]">Corte:</label>
            <select
              value={selectedCut ?? ''}
              onChange={(e) => setSelectedCut(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full rounded-lg border border-[#e9d9cc] bg-white px-3 py-2 text-sm text-[#2d2d2d] focus:border-[#b22222] focus:outline-none focus:ring-2 focus:ring-[#b22222]/20"
            >
              <option value="">Sin corte específico</option>
              {product.cuts?.map((cut) => (
                <option key={cut.cutId} value={cut.cutId}>
                  Corte #{cut.cutId}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.isActive}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#b22222] py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#921c1c] disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          <span>Agregar</span>
        </button>
      </div>
    </div>
  )
}
