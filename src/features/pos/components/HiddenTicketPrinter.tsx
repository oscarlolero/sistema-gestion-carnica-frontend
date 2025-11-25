import { createPortal } from 'react-dom'
import { TicketResponse } from '@/features/tickets/types'
import { PrintableTicket } from './PrintableTicket'

type HiddenTicketPrinterProps = {
  ticket: TicketResponse | null
}

export const HiddenTicketPrinter = ({ ticket }: HiddenTicketPrinterProps) => {
  if (!ticket) return null

  return createPortal(
    <div id="print-section">
      <PrintableTicket ticket={ticket} />
    </div>,
    document.body
  )
}
