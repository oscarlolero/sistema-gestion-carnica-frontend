import { useState } from 'react'
import { Button, InputNumber } from 'antd'
import { CloseOutlined, MinusOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'
import type { CartItem } from '../types'

type TicketItemProps = {
  item: CartItem
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
}

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

export const TicketItem = ({ item, onUpdateQuantity, onRemoveItem }: TicketItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [tempQuantity, setTempQuantity] = useState('')

  const handleQuantityClick = () => {
    setIsEditing(true)
    setTempQuantity(item.quantity.toString())
  }

  const handleQuantityConfirm = () => {
    if (tempQuantity) {
      const quantity = parseFloat(tempQuantity)
      if (!isNaN(quantity) && quantity > 0) {
        onUpdateQuantity(item.id, quantity)
      }
    }
    setIsEditing(false)
    setTempQuantity('')
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#f3e3d4] bg-[#fef9f4] p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#2d2d2d]">{item.productName}</p>
          {item.cutName && <p className="text-xs text-[#b22222]">{item.cutName}</p>}
          <p className="text-xs text-[#8c8c8c]">
            {formatter.format(item.unitPrice)} / {item.unit}
          </p>
        </div>
        <Button
          type="text"
          shape="circle"
          size="small"
          icon={<CloseOutlined />}
          onClick={() => onRemoveItem(item.id)}
          className="text-[#8c8c8c] hover:text-[#b22222] p-0 h-5 w-5 min-w-5 flex items-center justify-center"
          title="Eliminar"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            icon={<MinusOutlined />}
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            size="small"
            shape="circle"
            className="h-4 w-4 bg-white border-[#e9d9cc] text-[#b22222] hover:bg-[#fdf0ed] hover:border-[#e9d9cc] p-0"
          />
          {isEditing ? (
            <InputNumber
              value={tempQuantity}
              onChange={(value) => setTempQuantity(value ?? '')}
              onPressEnter={handleQuantityConfirm}
              onBlur={handleQuantityConfirm}
              size="small"
              autoFocus
              className="w-20 text-center text-sm font-semibold"
              type="number"
              min="0"
              step="1"
            />
          ) : (
            <span
              onClick={handleQuantityClick}
              className="flex items-center gap-1 min-w-10 text-center text-sm font-semibold text-[#2d2d2d] cursor-pointer hover:text-[#b22222] transition-colors"
            >
              <span>
                {item.quantity} {item.unit}
              </span>
              <EditOutlined className="text-[10px] opacity-60" />
            </span>
          )}
          <Button
            icon={<PlusOutlined size={16} />}
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            shape="circle"
            size="small"
            className="h-4 w-4 bg-white border-[#e9d9cc] text-[#b22222] hover:bg-[#fdf0ed] hover:border-[#e9d9cc] p-0"
          />
        </div>
        <span className="text-sm font-semibold text-[#b22222]">{formatter.format(item.subtotal)}</span>
      </div>
    </div>
  )
}
