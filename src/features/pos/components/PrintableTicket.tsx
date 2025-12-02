import type { TicketResponse } from '@/features/tickets/types'
import { TicketHeader, TicketItems, TicketFooter } from './TicketSections'
import { ticketStyles } from './ticketStyles'

type PrintableTicketProps = {
  ticket: TicketResponse
  showPrices?: boolean
}

export const PrintableTicket = ({ ticket, showPrices = true }: PrintableTicketProps) => {
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
    <div className="ticket-preview">
      <div className="ticket-content">
        <TicketHeader ticket={ticket} formatDate={formatDate} showPrices={showPrices} />
        <TicketItems ticket={ticket} showPrices={showPrices} />
        {showPrices && <TicketFooter total={ticket.total} />}
      </div>

      <style>{ticketStyles}</style>
    </div>
  )
}
