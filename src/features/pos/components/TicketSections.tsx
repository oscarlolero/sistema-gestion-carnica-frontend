import type { TicketResponse } from '@/features/tickets/types'

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

type TicketHeaderProps = {
  ticket: TicketResponse
  formatDate: (dateString: string) => string
  showPrices?: boolean
}

export const TicketHeader = ({ ticket, formatDate, showPrices = true }: TicketHeaderProps) => {
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
        {showPrices && (
          <p>
            <strong>Pago:</strong> {ticket.paymentType}
          </p>
        )}
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
  showPrices?: boolean
}

export const TicketItems = ({ ticket, showPrices = true }: TicketItemsProps) => {
  const headerStyle = showPrices ? {} : { gridTemplateColumns: '2fr 1fr' }

  const detailsStyle = showPrices ? {} : { gridTemplateColumns: '1fr', textAlign: 'left' as const }

  return (
    <div className="ticket-items">
      <div className="ticket-items-header" style={headerStyle}>
        <span>PRODUCTO</span>
        <span>CANT</span>
        {showPrices && <span>PRECIO</span>}
        {showPrices && <span>TOTAL</span>}
      </div>
      <div className="ticket-divider">{'-'.repeat(32)}</div>
      {ticket.items.map((item) => (
        <div key={item.id} className="ticket-item">
          <div className="ticket-item-name">
            {item.product.name}
            {item.cut && ` - ${item.cut.name}`}
          </div>
          <div className="ticket-item-details" style={detailsStyle}>
            <span>
              {item.quantity} {item.unit}
            </span>
            {showPrices && <span>{formatter.format(item.unitPrice)}</span>}
            {showPrices && <span>{formatter.format(item.subtotal)}</span>}
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
