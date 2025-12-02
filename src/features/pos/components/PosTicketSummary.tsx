import { useState } from 'react'
import { Button, Select, message } from 'antd'
import { FileTextOutlined, UserOutlined, UserAddOutlined } from '@ant-design/icons'
import type { CartItem, PaymentType } from '../types'
import { paymentTypeLabels } from '../types'
import { useCreateTicket } from '@/features/tickets/queries'
import type { User } from '@/features/users/types'
import type { TicketResponse } from '@/features/tickets/types'
import type { Client } from '@/features/clients/types'
import { useSetting } from '@/features/settings/queries'
import { AddUserModal } from './AddUserModal'
import { AddClientModal } from './AddClientModal'
import { PrintTicketModal } from './PrintTicketModal'
import { TicketItem } from './TicketItem'

type PosTicketSummaryProps = {
  items: CartItem[]
  paymentType: PaymentType
  onPaymentTypeChange: (type: PaymentType) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onClearCart: () => void
  users: User[]
  selectedUserId: number | null
  onUserChange: (userId: number | null) => void
  clients: Client[]
  selectedClientId: number | null
  onClientChange: (clientId: number | null) => void
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
  users,
  selectedUserId,
  onUserChange,
  clients,
  selectedClientId,
  onClientChange,
}: PosTicketSummaryProps) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPrintDialog, setShowPrintDialog] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showAddClientModal, setShowAddClientModal] = useState(false)
  const [createdTicket, setCreatedTicket] = useState<TicketResponse | null>(null)

  const { data: showPricesSetting } = useSetting('SHOW_PRICES_IN_POS')
  const showPrices = showPricesSetting?.value !== 'false'

  const createTicketMutation = useCreateTicket()

  const total = items.reduce((sum, item) => sum + item.subtotal, 0)

  const handleFinalizeSale = async () => {
    if (items.length === 0) {
      message.error('No hay productos en el carrito')
      return
    }

    if (!selectedUserId) {
      message.error('Debe seleccionar un empleado')
      return
    }

    setIsProcessing(true)
    try {
      const ticket = await createTicketMutation.mutateAsync({
        total,
        paymentType: paymentTypeLabels[paymentType],
        userId: selectedUserId,
        clientId: selectedClientId ?? undefined,
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
    <aside className="flex h-full flex-col rounded-3xl bg-white p-4 xl:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
      <div className="mb-4 xl:mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base xl:text-lg font-semibold text-[#2d2d2d]">Ticket Actual</h2>
          <span className="rounded-full bg-[#fdf0ed] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#b22222]">
            #{items.length.toString().padStart(3, '0')}
          </span>
        </div>

        {/* Employee Selection */}
        <div className="flex gap-2">
          <Select
            className="flex-1"
            placeholder="Seleccionar empleado"
            value={selectedUserId}
            onChange={onUserChange}
            options={users.map((user) => ({ label: user.name, value: user.id }))}
            suffixIcon={<UserOutlined className="text-[#b22222]" />}
          />
          <Button
            icon={<UserAddOutlined />}
            onClick={() => setShowAddUserModal(true)}
            className="border-[#b22222] text-[#b22222] hover:bg-[#fdf0ed] hover:border-[#b22222] hover:text-[#b22222]"
          />
        </div>

        {/* Client Selection */}
        <div className="flex gap-2">
          <Select
            className="flex-1"
            placeholder="Seleccionar cliente (Opcional)"
            value={selectedClientId}
            onChange={onClientChange}
            options={clients.map((client) => ({ label: client.name, value: client.id }))}
            allowClear
            suffixIcon={<UserOutlined className="text-[#b22222]" />}
          />
          <Button
            icon={<UserAddOutlined />}
            onClick={() => setShowAddClientModal(true)}
            className="border-[#b22222] text-[#b22222] hover:bg-[#fdf0ed] hover:border-[#b22222] hover:text-[#b22222]"
          />
        </div>
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
            <TicketItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
            />
          ))}
        </div>
      )}

      <div className="mt-4 xl:mt-6 space-y-3">
        {showPrices && (
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
        )}

        {showPrices && (
          <div className="flex items-center justify-between border-t border-[#e9d9cc] pt-3 text-sm text-[#4a4a4a]">
            <span>Total</span>
            <span className="text-lg font-semibold text-[#b22222]">{formatter.format(total)}</span>
          </div>
        )}

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

      {/* Modals */}
      <PrintTicketModal
        open={showPrintDialog}
        ticket={createdTicket}
        onConfirm={handlePrintConfirm}
        onCancel={handlePrintCancel}
      />

      <AddUserModal
        open={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onUserCreated={onUserChange}
      />

      <AddClientModal
        open={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        onClientCreated={onClientChange}
      />
    </aside>
  )
}
