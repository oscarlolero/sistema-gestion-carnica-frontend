import { forwardRef } from 'react'
import type { TicketResponse } from '@/features/tickets/types'

type PrintableTicketProps = {
  ticket: TicketResponse
}

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

export const PrintableTicket = forwardRef<HTMLDivElement, PrintableTicketProps>(
  ({ ticket }, ref) => {
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

    return (
      <div ref={ref} className="ticket-print">
        <div className="ticket-content">
          {/* Header */}
          <div className="ticket-header">
            <h1>CARNICERÍA</h1>
            <p className="ticket-subtitle">Sistema de Gestión</p>
          </div>

          {/* Divider */}
          <div className="ticket-divider">{'='.repeat(32)}</div>

          {/* Ticket Info */}
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
          </div>

          {/* Divider */}
          <div className="ticket-divider">{'='.repeat(32)}</div>

          {/* Items */}
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

          {/* Divider */}
          <div className="ticket-divider">{'='.repeat(32)}</div>

          {/* Total */}
          <div className="ticket-total">
            <span>TOTAL:</span>
            <span>{formatter.format(ticket.total)}</span>
          </div>

          {/* Divider */}
          <div className="ticket-divider">{'='.repeat(32)}</div>

          {/* Footer */}
          <div className="ticket-footer">
            <p>¡Gracias por su compra!</p>
            <p>Vuelva pronto</p>
          </div>
        </div>

        <style>{`
          @media print {
            @page {
              size: 52mm auto;
              margin: 0;
            }
            
            body {
              margin: 0;
              padding: 0;
            }
          }

          .ticket-print {
            width: 52mm;
            font-family: 'Courier New', monospace;
            font-size: 9px;
            line-height: 1.3;
            color: #000;
            background: white;
          }

          .ticket-content {
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

          /* Screen preview styles */
          @media screen {
            .ticket-print {
              border: 1px solid #ddd;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              margin: 0 auto;
            }
          }
        `}</style>
      </div>
    )
  },
)

PrintableTicket.displayName = 'PrintableTicket'
