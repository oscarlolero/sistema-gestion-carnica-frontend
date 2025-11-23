import { TicketResponse } from '@/features/tickets/types'

export const printTicket = (ticket: TicketResponse) => {
  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  })

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

  const ticketContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Ticket #${ticket.id}</title>
        <style>
          @page {
            size: 58mm auto;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 4mm;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            width: 58mm;
            box-sizing: border-box;
          }
          .header {
            text-align: center;
            margin-bottom: 10px;
          }
          .header h1 {
            font-size: 16px;
            margin: 0;
            font-weight: bold;
          }
          .header p {
            margin: 2px 0;
            font-size: 10px;
          }
          .divider {
            border-top: 1px dashed #000;
            margin: 5px 0;
          }
          .info {
            font-size: 10px;
            margin-bottom: 5px;
          }
          .info p {
            margin: 2px 0;
          }
          .items-header {
            display: flex;
            font-weight: bold;
            font-size: 10px;
            margin-bottom: 2px;
          }
          .col-qty { width: 15%; text-align: left; }
          .col-prod { width: 45%; text-align: left; }
          .col-price { width: 20%; text-align: right; }
          .col-total { width: 20%; text-align: right; }
          
          .item {
            display: flex;
            font-size: 10px;
            margin: 2px 0;
          }
          .total-section {
            margin-top: 10px;
            text-align: right;
            font-size: 14px;
            font-weight: bold;
          }
          .footer {
            margin-top: 15px;
            text-align: center;
            font-size: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>CARNICERÍA</h1>
          <p>Sistema de Gestión</p>
          <p>${formatDate(ticket.createdAt)}</p>
        </div>
        
        <div class="divider"></div>
        
        <div class="info">
          <p>Ticket: #${ticket.id.toString().padStart(6, '0')}</p>
          <p>Cajero: ${ticket.user?.name || 'General'}</p>
          <p>Pago: ${ticket.paymentType}</p>
        </div>

        <div class="divider"></div>

        <div class="items-header">
          <span class="col-qty">Cant</span>
          <span class="col-prod">Prod</span>
          <span class="col-price">P.U.</span>
          <span class="col-total">Total</span>
        </div>

        ${ticket.items
          .map(
            (item) => `
          <div class="item">
            <span class="col-qty">${item.quantity} ${item.unit}</span>
            <span class="col-prod">
              ${item.product.name}
              ${item.cut ? `<br/>- ${item.cut.name}` : ''}
            </span>
            <span class="col-price">${formatter.format(item.unitPrice)}</span>
            <span class="col-total">${formatter.format(item.subtotal)}</span>
          </div>
        `
          )
          .join('')}

        <div class="divider"></div>

        <div class="total-section">
          TOTAL: ${formatter.format(ticket.total)}
        </div>

        <div class="footer">
          <p>¡Gracias por su compra!</p>
        </div>
      </body>
    </html>
  `

  const printWindow = window.open('', '_blank', 'width=400,height=600')
  if (printWindow) {
    printWindow.document.write(ticketContent)
    printWindow.document.close()
    printWindow.focus()
    // Small delay to ensure styles are loaded
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }
}
