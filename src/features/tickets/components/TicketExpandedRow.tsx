import { useState, useRef } from 'react'
import { Tag, Button, Modal, message } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'
import { useReactToPrint } from 'react-to-print'
import type { TicketResponse } from '../types'
import { formatCurrency } from '@/utils'
import { PrintableTicket } from '@/features/pos/components/PrintableTicket'
import { useUpdateTicket } from '../queries'

interface TicketExpandedRowProps {
  ticket: TicketResponse
}

export const TicketExpandedRow = ({ ticket }: TicketExpandedRowProps) => {
  const [showPrintDialog, setShowPrintDialog] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)
  const updateTicketMutation = useUpdateTicket()

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Ticket-${ticket.id}`,
    onAfterPrint: async () => {
      if (!ticket.printed) {
        try {
          await updateTicketMutation.mutateAsync({
            id: ticket.id,
            dto: { printed: true },
          })
          message.success('Ticket marcado como impreso')
        } catch (error) {
          message.error('Error al actualizar el estado del ticket')
          console.error('Error updating ticket:', error)
        }
      }
    },
  })

  const handlePrintClick = () => {
    setShowPrintDialog(true)
  }

  const handlePrintConfirm = () => {
    handlePrint()
    setShowPrintDialog(false)
  }

  const handlePrintCancel = () => {
    setShowPrintDialog(false)
  }

  return (
    <div className="p-6 bg-[#F8F3ED]">
      <div className="mb-4 pb-3 border-b-2 border-[#B22222] flex items-center justify-between">
        <h4 className="text-lg font-semibold text-[#2C2C2C]">Items del Ticket</h4>
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrintClick}
          className="bg-[#B22222] hover:bg-[#921c1c] border-[#B22222] hover:border-[#921c1c]"
        >
          Imprimir Ticket
        </Button>
      </div>
      <div className="space-y-2">
        {ticket.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E8E8E8] hover:border-[#B22222] hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-1 h-10 bg-[#B22222] rounded-full shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[#2C2C2C] truncate">{item.product.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  {item.cut && (
                    <Tag className="bg-[#7D9A6D]/20 text-[#7D9A6D] border-[#7D9A6D]/30 text-xs h-5 px-2 m-0">
                      {item.cut.name}
                    </Tag>
                  )}
                  <span className="text-xs text-[#555555]">
                    {item.quantity} {item.unit} x {formatCurrency(item.unitPrice)}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0 ml-4">
              <div className="text-base font-bold text-[#B22222]">
                {formatCurrency(item.subtotal)}
              </div>
            </div>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t-2 border-[#E8E8E8]">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-[#2C2C2C]">Total del Ticket</div>
            <div className="text-xl font-bold text-[#B22222]">{formatCurrency(ticket.total)}</div>
          </div>
        </div>
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
        cancelText="Cancelar"
        width={600}
        centered
        okButtonProps={{
          className: 'bg-[#b22222] hover:bg-[#921c1c] border-[#b22222] hover:border-[#921c1c]',
        }}
      >
        <div className="py-4">
          <p className="mb-4 text-center text-[#4a4a4a]">¿Desea imprimir este ticket?</p>
          <div className="flex justify-center bg-gray-50 p-4 rounded-lg">
            <PrintableTicket ref={printRef} ticket={ticket} />
          </div>
        </div>
      </Modal>
    </div>
  )
}
