import { useState } from 'react'
import { Button, InputNumber, Modal, Select, Form, Input } from 'antd'
import {
  CloseOutlined,
  MinusOutlined,
  PlusOutlined,
  FileTextOutlined,
  EditOutlined,
  PrinterOutlined,
  UserOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import type { CartItem, PaymentType } from '../types'
import { paymentTypeLabels } from '../types'
import { useCreateTicket } from '@/features/tickets/queries'
import { useCreateUser } from '@/features/users/queries'
import type { User } from '@/features/users/types'
import { message } from 'antd'
import { PrintableTicket } from './PrintableTicket'
import type { TicketResponse } from '@/features/tickets/types'
import type { Client } from '@/features/clients/types'
import { useCreateClient } from '@/features/clients/queries'

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

const to2 = (n: number | string) => Number(n || 0).toFixed(2)

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
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [tempQuantity, setTempQuantity] = useState<string>('')
  const [showPrintDialog, setShowPrintDialog] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showAddClientModal, setShowAddClientModal] = useState(false)
  const [createdTicket, setCreatedTicket] = useState<TicketResponse | null>(null)
  
  const createTicketMutation = useCreateTicket()
  const createUserMutation = useCreateUser()
  const createClientMutation = useCreateClient()
  const [form] = Form.useForm()
  const [clientForm] = Form.useForm()

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

  const printTicket80mm = (ticket: TicketResponse) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    const itemsHtml = ticket.items.map((item) => `
      <div class="ticket-item">
        <div class="ticket-item-name">
          ${item.product.name}${item.cut ? ` - ${item.cut.name}` : ''}
        </div>
        <div class="ticket-item-details">
          <span>${item.quantity} ${item.unit}</span>
          <span>${formatter.format(item.unitPrice)}</span>
          <span>${formatter.format(item.subtotal)}</span>
        </div>
      </div>
    `).join('')

    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8" />
      <title>Ticket 80mm</title>
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          margin: 0;
          background: #fff;
          color: #000;
          font-family: 'Courier New', monospace;
        }
        
        .ticket-preview {
          width: 80mm;
          font-size: 9px;
          line-height: 1.3;
          color: #000;
          background: white;
          margin: 0 auto;
          padding: 4mm;
        }
        
        .ticket-header {
          text-align: center;
          margin-bottom: 8px;
        }
        
        .ticket-header h1 {
          font-size: 14px;
          font-weight: bold;
          margin: 0 0 2px 0;
          letter-spacing: 1px;
        }
        
        .ticket-subtitle {
          font-size: 9px;
          margin: 0;
        }
        
        .ticket-divider {
          margin: 4px 0;
          font-size: 8px;
          overflow: hidden;
        }
        
        .ticket-info {
          margin: 6px 0;
        }
        
        .ticket-info p {
          margin: 2px 0;
          font-size: 9px;
        }
        
        .ticket-info strong {
          font-weight: bold;
        }
        
        .ticket-items-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1.2fr 1.2fr;
          gap: 2px;
          font-weight: bold;
          font-size: 8px;
          margin-bottom: 2px;
        }
        
        .ticket-items-header span {
          text-align: right;
        }
        
        .ticket-items-header span:first-child {
          text-align: left;
        }
        
        .ticket-item {
          margin: 4px 0;
        }
        
        .ticket-item-name {
          font-size: 9px;
          font-weight: bold;
          margin-bottom: 2px;
          word-wrap: break-word;
        }
        
        .ticket-item-details {
          display: grid;
          grid-template-columns: 1fr 1.2fr 1.2fr;
          gap: 2px;
          font-size: 8px;
          text-align: right;
        }
        
        .ticket-total {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          font-weight: bold;
          margin: 6px 0;
        }
        
        .ticket-footer {
          text-align: center;
          margin-top: 8px;
          font-size: 9px;
        }
        
        .ticket-footer p {
          margin: 2px 0;
        }
        
        .ticket-signature {
          text-align: center;
          margin-top: 8px;
          font-size: 9px;
        }
        
        .ticket-signature p {
          margin: 4px 0 2px 0;
          font-weight: bold;
        }
        
        .signature-line {
          border-bottom: 1px solid #000;
          width: 100%;
          height: 20px;
          margin-top: 4px;
        }
        
        @media print {
          @page {
            size: 80mm auto;
            margin: 0mm;
          }
          
          body {
            background: #fff;
          }
          
          .ticket-preview {
            width: 80mm;
            max-width: 80mm;
            margin: 0;
            padding: 2mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="ticket-preview">
        <div class="ticket-content">
          <!-- Header -->
          <div class="ticket-header">
            <h1>CARNICERÍA</h1>
            <p class="ticket-subtitle">Sistema de Gestión</p>
          </div>

          <!-- Divider -->
          <div class="ticket-divider">${'='.repeat(32)}</div>

          <!-- Ticket Info -->
          <div class="ticket-info">
            <p><strong>Ticket:</strong> #${ticket.id.toString().padStart(6, '0')}</p>
            <p><strong>Fecha:</strong> ${formatDate(ticket.createdAt)}</p>
            <p><strong>Pago:</strong> ${ticket.paymentType}</p>
            ${ticket.user ? `<p><strong>Cajero:</strong> ${ticket.user.name}</p>` : ''}
            ${ticket.client ? `<p><strong>Cliente:</strong> ${ticket.client.name}</p>` : ''}
          </div>

          <!-- Divider -->
          <div class="ticket-divider">${'='.repeat(32)}</div>

          <!-- Items -->
          <div class="ticket-items">
            <div class="ticket-items-header">
              <span>PRODUCTO</span>
              <span>CANT</span>
              <span>PRECIO</span>
              <span>TOTAL</span>
            </div>
            <div class="ticket-divider">${'-'.repeat(32)}</div>
            ${itemsHtml}
          </div>

          <!-- Divider -->
          <div class="ticket-divider">${'='.repeat(32)}</div>

          <!-- Total -->
          <div class="ticket-total">
            <span>TOTAL:</span>
            <span>${formatter.format(ticket.total)}</span>
          </div>

          <!-- Divider -->
          <div class="ticket-divider">${'='.repeat(32)}</div>

          <!-- Footer -->
          <div class="ticket-footer">
            <p>¡Gracias por su compra!</p>
            <p>Vuelva pronto</p>
          </div>

          <!-- Signature -->
          <div class="ticket-signature">
            <p>Firma de recibido:</p>
            <div class="signature-line">____________________</div>
          </div>
        </div>
      </div>
    </body>
    </html>
    `

    const win = window.open('', '_blank', 'width=400,height=600')
    if (win) {
      win.document.open()
      win.document.write(html)
      win.document.close()
      win.focus()
      setTimeout(() => { win.print() }, 300)
    }
  }

  const handlePrintConfirm = () => {
    if (createdTicket) {
      printTicket80mm(createdTicket)
    }
    setShowPrintDialog(false)
    onClearCart()
    setCreatedTicket(null)
  }

  const handlePrintCancel = () => {
    setShowPrintDialog(false)
    onClearCart()
    setCreatedTicket(null)
  }

  const handleCreateUser = async (values: { name: string }) => {
    try {
      const newUser = await createUserMutation.mutateAsync(values)
      message.success('Empleado agregado exitosamente')
      setShowAddUserModal(false)
      form.resetFields()
      onUserChange(newUser.id)
    } catch (error) {
      message.error('Error al agregar empleado')
      console.error('Error creating user:', error)
    }
  }

  const handleCreateClient = async (values: { name: string }) => {
    try {
      const newClient = await createClientMutation.mutateAsync(values)
      message.success('Cliente agregado exitosamente')
      setShowAddClientModal(false)
      clientForm.resetFields()
      onClientChange(newClient.id)
    } catch (error) {
      message.error('Error al agregar cliente')
      console.error('Error creating client:', error)
    }
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

      <div className="mt-4 xl:mt-6 space-y-3">
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
              <PrintableTicket ticket={createdTicket} />
            </div>
          )}
        </div>
      </Modal>

      {/* Add User Modal */}
      <Modal
        title="Agregar Empleado"
        open={showAddUserModal}
        onCancel={() => {
          setShowAddUserModal(false)
          form.resetFields()
        }}
        footer={null}
        centered
      >
        <Form form={form} onFinish={handleCreateUser} layout="vertical">
          <Form.Item
            name="name"
            label="Nombre del empleado"
            rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
          >
            <Input placeholder="Ej. Juan Perez" />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setShowAddUserModal(false)}>Cancelar</Button>
            <Button type="primary" htmlType="submit" loading={createUserMutation.isPending} className="bg-[#b22222] hover:bg-[#921c1c]">
              Guardar
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Add Client Modal */}
      <Modal
        title="Agregar Cliente"
        open={showAddClientModal}
        onCancel={() => {
          setShowAddClientModal(false);
          clientForm.resetFields();
        }}
        footer={null}
        centered
      >
        <Form form={clientForm} onFinish={handleCreateClient} layout="vertical">
          <Form.Item
            name="name"
            label="Nombre del cliente"
            rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
          >
            <Input placeholder="Ej. Cliente XYZ" />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setShowAddClientModal(false)}>Cancelar</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createClientMutation.isPending}
              className="bg-[#b22222] hover:bg-[#921c1c]"
            >
              Guardar
            </Button>
          </div>
        </Form>
      </Modal>
    </aside>
  )
}
