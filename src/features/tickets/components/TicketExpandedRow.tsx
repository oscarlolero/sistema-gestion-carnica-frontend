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
                    {item.quantity} x {formatCurrency(item.unitPrice)}
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
    </div>
  )
}
