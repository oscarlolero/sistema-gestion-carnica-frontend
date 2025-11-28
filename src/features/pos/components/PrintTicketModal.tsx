import { Modal } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'
import type { TicketResponse } from '@/features/tickets/types'
import { PrintableTicket } from './PrintableTicket'
import { generateTicket80mmHTML } from '../utils/printTicket'

type PrintTicketModalProps = {
  open: boolean
  ticket: TicketResponse | null
  onConfirm: () => void
  onCancel: () => void
}

const printTicket80mm = (ticket: TicketResponse) => {
  const html = generateTicket80mmHTML(ticket)

  const win = window.open('', '_blank', 'width=400,height=600')
  if (win) {
    win.document.open()
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => {
      win.print()
    }, 300)
  }
}

export const PrintTicketModal = ({ open, ticket, onConfirm, onCancel }: PrintTicketModalProps) => {
  const handlePrint = () => {
    if (ticket) {
      printTicket80mm(ticket)
    }
    onConfirm()
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <PrinterOutlined className="text-[#b22222]" />
          <span>Imprimir Ticket</span>
        </div>
      }
      open={open}
      onOk={handlePrint}
      onCancel={onCancel}
      okText="Imprimir"
      cancelText="No imprimir"
      width={600}
      centered
      okButtonProps={{
        className: 'bg-[#b22222] hover:bg-[#921c1c] border-[#b22222] hover:border-[#921c1c]',
      }}
    >
      <div className="py-4">
        <p className="mb-4 text-center text-[#4a4a4a]">¿Desea imprimir el ticket de esta venta?</p>
        {ticket && (
          <div className="flex justify-center bg-gray-50 p-4 rounded-lg">
            <PrintableTicket ticket={ticket} />
          </div>
        )}
      </div>
    </Modal>
  )
}
