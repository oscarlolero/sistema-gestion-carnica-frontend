import { Card } from 'antd'
import { DollarOutlined, ShoppingOutlined } from '@ant-design/icons'
import { formatCurrency } from '@/utils'

type SummaryCardsProps = {
  totalSales: number
  totalTickets: number
}

export const SummaryCards = ({ totalSales, totalTickets }: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-linear-to-br from-[#B22222] to-[#8B1A1A] rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <DollarOutlined className="text-3xl" />
          <div className="text-sm opacity-90">Total Vendido</div>
        </div>
        <div className="text-3xl font-bold">{formatCurrency(totalSales)}</div>
      </div>

      <div className="bg-linear-to-br from-[#7D9A6D] to-[#6B8A5A] rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingOutlined className="text-3xl" />
          <div className="text-sm opacity-90">Total Tickets</div>
        </div>
        <div className="text-3xl font-bold">{totalTickets}</div>
      </div>
    </div>
  )
}

type SummaryItem = {
  productName: string
  cutName: string | null
  quantity: number
  unit: string
  totalAmount: number
}

type ItemsListProps = {
  items: SummaryItem[]
  totalSales: number
}

export const ItemsList = ({ items, totalSales }: ItemsListProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4 flex items-center gap-2">
        <div className="w-1 h-6 bg-[#B22222] rounded-full" />
        Detalle por Producto
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {items.map((item, index) => (
          <Card
            key={index}
            className="bg-white border border-[#E8E8E8] rounded-lg p-4 hover:border-[#B22222] hover:shadow-md transition-all"
            bordered={false}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-[#2C2C2C] text-base mb-1">
                  {item.productName}
                  {item.cutName && <span className="ml-2 text-sm font-normal text-[#7D9A6D]">• {item.cutName}</span>}
                </div>
                <div className="text-sm text-[#555555]">
                  Cantidad: {item.quantity.toFixed(2)} {item.unit}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-[#B22222]">{formatCurrency(item.totalAmount)}</div>
                <div className="text-xs text-[#888888]">
                  {((item.totalAmount / totalSales) * 100).toFixed(1)}% del total
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
