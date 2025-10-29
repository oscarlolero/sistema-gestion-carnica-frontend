import { useState, useRef } from 'react'
import { Button, InputNumber, Modal } from 'antd'
import {
  CloseOutlined,
  MinusOutlined,
  PlusOutlined,
  FileTextOutlined,
  EditOutlined,
  PrinterOutlined,
} from '@ant-design/icons'
import type { CartItem, PaymentType } from '../types'
import { paymentTypeLabels } from '../types'
import { useCreateTicket } from '@/features/tickets/queries'
import { message } from 'antd'
import { useReactToPrint } from 'react-to-print'
import { PrintableTicket } from './PrintableTicket'
import type { TicketResponse } from '@/features/tickets/types'

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
  currency: 'MXN',
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
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [tempQuantity, setTempQuantity] = useState<string>('')
  const [showPrintDialog, setShowPrintDialog] = useState(false)
  const [createdTicket, setCreatedTicket] = useState<TicketResponse | null>(null)
  const printRef = useRef<HTMLDivElement>(null)
  const createTicketMutation = useCreateTicket()

  const total = items.reduce((sum, item) => sum + item.subtotal, 0)

  const handleQuantityClick = (item: CartItem) => {
    setEditingItemId(item.id)
    setTempQuantity(item.quantity.toString())
  }

  const handleQuantityChange = (value: string) => {
    setTempQuantity(value)
  }

  const handleQuantityConfirm = () => {
    if (editingItemId && tempQuantity) {
      const quantity = parseFloat(tempQuantity)
      if (!isNaN(quantity) && quantity > 0) {
        onUpdateQuantity(editingItemId, quantity)
      }
    }
    setEditingItemId(null)
    setTempQuantity('')
  }

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Ticket-${createdTicket?.id || 'preview'}`,
  })

  const handleFinalizeSale = async () => {
    if (items.length === 0) {
      message.error('No hay productos en el carrito')
      return
    }

    setIsProcessing(true)
    try {
      const ticket = await createTicketMutation.mutateAsync({
        total,
        paymentType: paymentTypeLabels[paymentType],
        items: items.map((item) => ({
          productId: item.productId,
          cutId: item.cutId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
          unit: item.unit,
        })),
      })

      setCreatedTicket(ticket)
      setShowPrintDialog(true)
      message.success('Venta finalizada exitosamente')
    } catch (error) {
      message.error('Error al finalizar la venta')
      console.error('Error creating ticket:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePrintConfirm = () => {
    handlePrint()
    setShowPrintDialog(false)
    onClearCart()
    setCreatedTicket(null)
  }

  const handlePrintCancel = () => {
    setShowPrintDialog(false)
    onClearCart()
    setCreatedTicket(null)
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
          <FileTextOutlined className="text-6xl text-[#e9d9cc]" />
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
                  {editingItemId === item.id ? (
                    <InputNumber
                      value={tempQuantity}
                      onChange={(value) => handleQuantityChange(value ?? '')}
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
                      onClick={() => handleQuantityClick(item)}
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
              <Button
                key={type}
                size="small"
                type={paymentType === type ? 'primary' : 'default'}
                onClick={() => onPaymentTypeChange(type)}
                className={`rounded-lg px-3 py-2 h-auto text-xs font-medium ${
                  paymentType === type
                    ? 'bg-[#b22222] border-[#b22222] text-white hover:bg-[#921c1c] hover:border-[#921c1c] [&.ant-btn-primary]:bg-[#b22222] [&.ant-btn-primary]:border-[#b22222] [&.ant-btn-primary]:hover:bg-[#921c1c] [&.ant-btn-primary]:hover:border-[#921c1c]'
                    : 'bg-white border-[#e9d9cc] text-[#4a4a4a] hover:border-[#b22222]/20'
                }`}
              >
                {paymentTypeLabels[type]}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#e9d9cc] pt-3 text-sm text-[#4a4a4a]">
          <span>Total</span>
          <span className="text-lg font-semibold text-[#b22222]">{formatter.format(total)}</span>
        </div>

        <Button
          type="primary"
          onClick={handleFinalizeSale}
          disabled={items.length === 0 || isProcessing}
          className="w-full rounded-full bg-[#b22222] py-3 h-auto text-sm font-semibold text-white hover:bg-[#921c1c] disabled:bg-gray-400 disabled:cursor-not-allowed [&.ant-btn-primary]:bg-[#b22222] [&.ant-btn-primary]:hover:bg-[#921c1c] [&.ant-btn-primary]:disabled:bg-gray-400"
        >
          {isProcessing ? 'Procesando...' : 'Finalizar Venta'}
        </Button>
        <Button
          type="default"
          onClick={onClearCart}
          disabled={items.length === 0}
          className="w-full rounded-full border-transparent bg-[#f7f0e6] py-3 h-auto text-sm font-semibold text-[#b22222] hover:border-[#b22222]/20 disabled:opacity-50 disabled:cursor-not-allowed [&.ant-btn]:bg-[#f7f0e6] [&.ant-btn]:border-transparent [&.ant-btn]:text-[#b22222]"
        >
          Cancelar Venta
        </Button>
      </div>

      {/* Print Dialog */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <PrinterOutlined className="text-[#b22222]" />
            <span>Imprimir Ticket</span>
          </div>
        }
        open={showPrintDialog}
        onOk={handlePrintConfirm}
        onCancel={handlePrintCancel}
        okText="Imprimir"
        cancelText="No imprimir"
        width={600}
        centered
        okButtonProps={{
          className: 'bg-[#b22222] hover:bg-[#921c1c] border-[#b22222] hover:border-[#921c1c]',
        }}
      >
        <div className="py-4">
          <p className="mb-4 text-center text-[#4a4a4a]">
            ¿Desea imprimir el ticket de esta venta?
          </p>
          {createdTicket && (
            <div className="flex justify-center bg-gray-50 p-4 rounded-lg">
              <PrintableTicket ref={printRef} ticket={createdTicket} />
            </div>
          )}
        </div>
      </Modal>
    </aside>
  )
}
