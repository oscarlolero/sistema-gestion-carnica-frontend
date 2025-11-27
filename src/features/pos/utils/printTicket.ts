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
