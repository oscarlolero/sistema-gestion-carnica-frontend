import { useState } from 'react'
import type { CartItem, PaymentType } from '../types'
import { paymentTypeLabels } from '../types'
import { useCreateTicket } from '@/features/tickets/queries'
import { message } from 'antd'

type PosTicketSummaryProps = {
  items: CartItem[]
  paymentType: PaymentType
  onPaymentTypeChange: (type: PaymentType) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onClearCart: () => void
}

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'USD',
})

export const PosTicketSummary = ({
  items,
  paymentType,
  onPaymentTypeChange,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: PosTicketSummaryProps) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const createTicketMutation = useCreateTicket()

  const total = items.reduce((sum, item) => sum + item.subtotal, 0)

  const handleFinalizeSale = async () => {
    if (items.length === 0) {
      message.error('No hay productos en el carrito')
      return
    }

    setIsProcessing(true)
    try {
      await createTicketMutation.mutateAsync({
        total,
        paymentType: paymentTypeLabels[paymentType],
        items: items.map((item) => ({
          productId: item.productId,
          cutId: item.cutId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        })),
      })

      message.success('Venta finalizada exitosamente')
      onClearCart()
    } catch (error) {
      message.error('Error al finalizar la venta')
      console.error('Error creating ticket:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <aside className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#2d2d2d]">Ticket Actual</h2>
        <span className="rounded-full bg-[#fdf0ed] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#b22222]">
          #{items.length.toString().padStart(3, '0')}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center text-[#9c9c9c]">
          <svg
            className="h-16 w-16 text-[#e9d9cc]"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M8 12C8 10.3431 9.34315 9 11 9H37C38.6569 9 40 10.3431 40 12V39C40 40.6569 38.6569 42 37 42H11C9.34315 42 8 40.6569 8 39V12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 9V6C16 4.89543 16.8954 4 18 4H30C31.1046 4 32 4.89543 32 6V9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 21H34"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 29H27"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <p className="text-sm font-semibold">No hay productos agregados</p>
            <p className="text-sm">Agrega productos al ticket para comenzar</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl border border-[#f3e3d4] bg-[#fef9f4] p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#2d2d2d]">{item.productName}</p>
                  {item.cutName && <p className="text-xs text-[#b22222]">{item.cutName}</p>}
                  <p className="text-xs text-[#8c8c8c]">
                    {formatter.format(item.unitPrice)} / {item.unit}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-[#8c8c8c] hover:text-[#b22222] transition-colors"
                  title="Eliminar"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white border border-[#e9d9cc] text-[#b22222] hover:bg-[#fdf0ed] transition-colors"
                  >
                    -
                  </button>
                  <span className="min-w-[3rem] text-center text-sm font-semibold text-[#2d2d2d]">
                    {item.quantity} {item.unit}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white border border-[#e9d9cc] text-[#b22222] hover:bg-[#fdf0ed] transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm font-semibold text-[#b22222]">
                  {formatter.format(item.subtotal)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-3">
        <div className="space-y-2">
          <label className="text-xs font-medium text-[#8c8c8c]">Método de pago:</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(paymentTypeLabels) as PaymentType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onPaymentTypeChange(type)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  paymentType === type
                    ? 'bg-[#b22222] text-white'
                    : 'bg-white border border-[#e9d9cc] text-[#4a4a4a] hover:border-[#b22222]/20'
                }`}
              >
                {paymentTypeLabels[type]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#e9d9cc] pt-3 text-sm text-[#4a4a4a]">
          <span>Total</span>
          <span className="text-lg font-semibold text-[#b22222]">{formatter.format(total)}</span>
        </div>

        <button
          type="button"
          onClick={handleFinalizeSale}
          disabled={items.length === 0 || isProcessing}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#b22222] py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#921c1c] disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isProcessing ? 'Procesando...' : 'Finalizar Venta'}
        </button>
        <button
          type="button"
          onClick={onClearCart}
          disabled={items.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-transparent bg-[#f7f0e6] py-3 text-sm font-semibold text-[#b22222] transition-colors duration-200 hover:border-[#b22222]/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancelar Venta
        </button>
      </div>
    </aside>
  )
}
