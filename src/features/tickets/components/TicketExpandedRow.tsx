import { Tag } from 'antd'
import type { TicketResponse } from '../types'
import { formatCurrency } from '@/utils'

interface TicketExpandedRowProps {
  ticket: TicketResponse
}

export const TicketExpandedRow = ({ ticket }: TicketExpandedRowProps) => {
  return (
    <div className="p-6 bg-[#F8F3ED]">
      <div className="mb-4 pb-3 border-b-2 border-[#B22222]">
        <h4 className="text-lg font-semibold text-[#2C2C2C]">Items del Ticket</h4>
      </div>
      <div className="space-y-3">
        {ticket.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#E8E8E8] hover:border-[#B22222] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-1 h-12 bg-[#B22222] rounded-full" />
              <div>
                <div className="font-semibold text-[#2C2C2C]">{item.product.name}</div>
                {item.cut && (
                  <Tag className="mt-1 bg-[#7D9A6D]/20 text-[#7D9A6D] border-[#7D9A6D]/30">
                    {item.cut.name}
                  </Tag>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-[#555555] mb-1">
                {item.quantity} x {formatCurrency(item.unitPrice)}
              </div>
              <div className="text-lg font-bold text-[#B22222]">
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
    </div>
  )
}
