import type { TicketResponse } from '@/features/tickets/types'
import { TicketHeader, TicketItems, TicketFooter } from './TicketSections'
import { ticketStyles } from './ticketStyles'

type PrintableTicketProps = {
  ticket: TicketResponse
}

export const PrintableTicket = ({ ticket }: PrintableTicketProps) => {
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
        <TicketHeader ticket={ticket} formatDate={formatDate} />
        <TicketItems ticket={ticket} />
        <TicketFooter total={ticket.total} />
      </div>

      <style>{ticketStyles}</style>
    </div>
  )
}
