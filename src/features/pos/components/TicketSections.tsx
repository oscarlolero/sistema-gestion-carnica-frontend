import type { TicketResponse } from '@/features/tickets/types'

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

type TicketHeaderProps = {
  ticket: TicketResponse
  formatDate: (dateString: string) => string
}

export const TicketHeader = ({ ticket, formatDate }: TicketHeaderProps) => {
  return (
    <>
      <div className="ticket-header">
        <h1>CARNICERÍA</h1>
        <p className="ticket-subtitle">Sistema de Gestión</p>
      </div>

      <div className="ticket-divider">{'='.repeat(32)}</div>

      <div className="ticket-info">
        <p>
          <strong>Ticket:</strong> #{ticket.id.toString().padStart(6, '0')}
        </p>
        <p>
          <strong>Fecha:</strong> {formatDate(ticket.createdAt)}
        </p>
        <p>
          <strong>Pago:</strong> {ticket.paymentType}
        </p>
        {ticket.user && (
          <p>
            <strong>Cajero:</strong> {ticket.user.name}
          </p>
        )}
        {ticket.client && (
          <p>
            <strong>Cliente:</strong> {ticket.client.name}
          </p>
        )}
      </div>

      <div className="ticket-divider">{'='.repeat(32)}</div>
    </>
  )
}

type TicketItemsProps = {
  ticket: TicketResponse
}

export const TicketItems = ({ ticket }: TicketItemsProps) => {
  return (
    <div className="ticket-items">
      <div className="ticket-items-header">
        <span>PRODUCTO</span>
        <span>CANT</span>
        <span>PRECIO</span>
        <span>TOTAL</span>
      </div>
      <div className="ticket-divider">{'-'.repeat(32)}</div>
      {ticket.items.map((item) => (
        <div key={item.id} className="ticket-item">
          <div className="ticket-item-name">
            {item.product.name}
            {item.cut && ` - ${item.cut.name}`}
          </div>
          <div className="ticket-item-details">
            <span>
              {item.quantity} {item.unit}
            </span>
            <span>{formatter.format(item.unitPrice)}</span>
            <span>{formatter.format(item.subtotal)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

type TicketFooterProps = {
  total: number
}

export const TicketFooter = ({ total }: TicketFooterProps) => {
  return (
    <>
      <div className="ticket-divider">{'='.repeat(32)}</div>

      <div className="ticket-total">
        <span>TOTAL:</span>
        <span>{formatter.format(total)}</span>
      </div>

      <div className="ticket-divider">{'='.repeat(32)}</div>

      <div className="ticket-footer">
        <p>¡Gracias por su compra!</p>
        <p>Vuelva pronto</p>
      </div>

      <div className="ticket-signature">
        <p>Firma de recibido:</p>
        <div className="signature-line">____________________</div>
      </div>
    </>
  )
}
