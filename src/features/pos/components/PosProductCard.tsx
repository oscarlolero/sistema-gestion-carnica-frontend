import { useState, useEffect } from 'react'
import { CloseOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { Button, InputNumber, Select } from 'antd'
import type { ProductResponse } from '@/features/products/types'
import { useProductPricing } from '../hooks/useProductPricing'
import { useSetting } from '@/features/settings/queries'

type PosProductCardProps = {
  product: ProductResponse
  onAdd: (product: ProductResponse, cutId?: number, unit?: 'kg' | 'pz', quantity?: number) => void
}

export const PosProductCard = ({ product, onAdd }: PosProductCardProps) => {
  const [selectedCut, setSelectedCut] = useState<number | undefined>(undefined)
  const [showQuantityInput, setShowQuantityInput] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const { data: showPricesSetting } = useSetting('SHOW_PRICES_IN_POS')
  const showPrices = showPricesSetting?.value !== 'false' // Default to true if not set or anything else

  const hasCuts = product.cuts && product.cuts.length > 0
  const { selectedUnit, setSelectedUnit, price, hasBothPrices } = useProductPricing(
    product,
    selectedCut,
  )

  // Reset quantity input when changing cut or unit
  useEffect(() => {
    setShowQuantityInput(false)
    setQuantity(1)
  }, [selectedCut, selectedUnit])

  const handleCutChange = (cutId: number | undefined) => {
    setSelectedCut(cutId)
  }

  const handleAdd = () => {
    if (!showQuantityInput) {
      setShowQuantityInput(true)
    } else {
      if (quantity > 0) {
        onAdd(product, hasCuts ? selectedCut : undefined, selectedUnit, quantity)
        setShowQuantityInput(false)
        setQuantity(1)
      }
    }
  }

  const handleQuantityChange = (value: number | null) => {
    if (value !== null && value > 0) {
      setQuantity(value)
    }
  }

  const handleCancelQuantity = () => {
    setShowQuantityInput(false)
    setQuantity(1)
  }

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
      <div className="relative h-40 overflow-hidden bg-linear-to-br from-[#fef9f4] to-[#f7f0e6]">
        {product.imageUrl && typeof product.imageUrl === 'string' ? (
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#b22222]/20">{product.name.charAt(0)}</div>
            </div>
          </div>
        )}
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
            <p className="text-sm text-[#8c8c8c]">
              {selectedUnit === 'kg' ? 'Por kg' : 'Por pieza'}
            </p>
          </div>
          {showPrices && (
            <span className="rounded-full bg-[#fdf0ed] px-3 py-1 text-sm font-semibold text-[#b22222]">
              ${price.toFixed(2)}
            </span>
          )}
        </div>

        {hasCuts && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#8c8c8c]">Corte:</label>
            <Select
              value={selectedCut}
              onChange={handleCutChange}
              placeholder="Sin corte específico"
              className="w-full"
              options={[
                { label: 'Sin corte específico', value: undefined },
                ...(product.cuts?.map((cut) => ({
                  label: cut.cut?.name ?? `Corte #${cut.cutId}`,
                  value: cut.cutId,
                })) ?? []),
              ]}
            />
          </div>
        )}

        {hasBothPrices && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#8c8c8c]">Vender por:</label>
            <div className="flex gap-2">
              <Button
                type={selectedUnit === 'kg' ? 'primary' : 'default'}
                className="flex-1 border-[#e9d9cc] text-sm font-medium h-auto py-2 [&.ant-btn-primary]:bg-[#b22222] [&.ant-btn-primary]:border-[#b22222] [&.ant-btn]:border-[#e9d9cc] [&.ant-btn]:text-[#2d2d2d] hover:[&.ant-btn]:border-[#b22222]"
                onClick={() => setSelectedUnit('kg')}
              >
                Kilogramo
              </Button>
              <Button
                type={selectedUnit === 'pz' ? 'primary' : 'default'}
                className="flex-1 border-[#e9d9cc] text-sm font-medium h-auto py-2 [&.ant-btn-primary]:bg-[#b22222] [&.ant-btn-primary]:border-[#b22222] [&.ant-btn]:border-[#e9d9cc] [&.ant-btn]:text-[#2d2d2d] hover:[&.ant-btn]:border-[#b22222]"
                onClick={() => setSelectedUnit('pz')}
              >
                Pieza
              </Button>
            </div>
          </div>
        )}

        <div className="mt-auto">
          {!showQuantityInput ? (
            <Button
              type="primary"
              disabled={!product.isActive}
              onClick={handleAdd}
              className="w-full bg-[#b22222] text-sm font-semibold hover:bg-[#921c1c] disabled:bg-gray-400 [&.ant-btn-primary]:bg-[#b22222] [&.ant-btn-primary]:hover:bg-[#921c1c]"
            >
              Agregar
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                type="default"
                icon={<CloseOutlined />}
                onClick={handleCancelQuantity}
                shape="circle"
                className="shrink-0 bg-gray-400 border-none text-white hover:bg-gray-500 w-9 h-9 p-0 [&.ant-btn]:bg-gray-400 [&.ant-btn]:hover:bg-gray-500 [&.ant-btn]:border-none [&.ant-btn-circle]:w-9 [&.ant-btn-circle]:h-9 [&.ant-btn-circle]:min-w-9"
              />
              <InputNumber
                min={1}
                step={1}
                value={quantity}
                onChange={handleQuantityChange}
                onPressEnter={handleAdd}
                autoFocus
                className="flex-1 [&_.ant-input]:text-center [&_.ant-input]:font-semibold"
              />
              <Button
                type="primary"
                icon={<ArrowRightOutlined />}
                onClick={handleAdd}
                shape="circle"
                className="shrink-0 bg-[#b22222] border-[#b22222] text-white hover:bg-[#921c1c] hover:border-[#921c1c] w-9 h-9 p-0 [&.ant-btn-primary]:bg-[#b22222] [&.ant-btn-primary]:hover:bg-[#921c1c] [&.ant-btn-primary]:border-[#b22222] [&.ant-btn-circle]:w-9 [&.ant-btn-circle]:h-9 [&.ant-btn-circle]:min-w-9"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
