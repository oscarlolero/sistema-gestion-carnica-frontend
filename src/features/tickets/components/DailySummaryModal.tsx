import { Modal, DatePicker, Spin, Button, Empty } from 'antd'
import {
  WhatsAppOutlined,
  CalendarOutlined,
  DollarOutlined,
  ShoppingOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import { useDailySummary } from '../queries'
import { formatCurrency, dateFormat } from '@/utils'

interface DailySummaryModalProps {
  open: boolean
  onClose: () => void
}

export const DailySummaryModal = ({ open, onClose }: DailySummaryModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())
  const { data: summary, isLoading } = useDailySummary(selectedDate.toISOString())

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  const generateWhatsAppMessage = () => {
    if (!summary) return ''

    let message = `📊 *RESUMEN DE VENTAS*\n`
    message += `📅 Fecha: ${dateFormat(summary.date)}\n\n`
    message += `💰 Total Vendido: *${formatCurrency(summary.totalSales)}*\n`
    message += `🎫 Total Tickets: *${summary.totalTickets}*\n\n`
    message += `📦 *DETALLE POR PRODUCTO:*\n`
    message += `${'─'.repeat(35)}\n\n`

    summary.items.forEach((item, index) => {
      const productName = item.cutName ? `${item.productName} - ${item.cutName}` : item.productName
      message += `${index + 1}. *${productName}*\n`
      message += `   Cantidad: ${item.quantity.toFixed(2)} ${item.unit}\n`
      message += `   Total: ${formatCurrency(item.totalAmount)}\n\n`
    })

    return encodeURIComponent(message)
  }

  const handleWhatsAppShare = () => {
    const message = generateWhatsAppMessage()
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={800}
      footer={null}
      title={
        <div className="flex items-center gap-3 text-2xl font-bold text-[#2C2C2C]">
          <ShoppingOutlined className="text-[#B22222]" />
          Resumen del Día
        </div>
      }
    >
      <div className="py-4">
        {/* Date Picker */}
        <div className="mb-6 flex items-center gap-3">
          <CalendarOutlined className="text-xl text-[#B22222]" />
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            format="DD/MM/YYYY"
            placeholder="Seleccionar fecha"
            size="large"
            className="flex-1"
            allowClear={false}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : !summary || summary.items.length === 0 ? (
          <Empty
            description="No hay ventas para esta fecha"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="py-8"
          />
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-linear-to-br from-[#B22222] to-[#8B1A1A] rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <DollarOutlined className="text-3xl" />
                  <div className="text-sm opacity-90">Total Vendido</div>
                </div>
                <div className="text-3xl font-bold">{formatCurrency(summary.totalSales)}</div>
              </div>

              <div className="bg-linear-to-br from-[#7D9A6D] to-[#6B8A5A] rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <ShoppingOutlined className="text-3xl" />
                  <div className="text-sm opacity-90">Total Tickets</div>
                </div>
                <div className="text-3xl font-bold">{summary.totalTickets}</div>
              </div>
            </div>

            {/* Items List */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-[#B22222] rounded-full" />
                Detalle por Producto
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {summary.items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-[#E8E8E8] rounded-lg p-4 hover:border-[#B22222] hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-[#2C2C2C] text-base mb-1">
                          {item.productName}
                          {item.cutName && (
                            <span className="ml-2 text-sm font-normal text-[#7D9A6D]">
                              • {item.cutName}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-[#555555]">
                          Cantidad: {item.quantity.toFixed(2)} {item.unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-[#B22222]">
                          {formatCurrency(item.totalAmount)}
                        </div>
                        <div className="text-xs text-[#888888]">
                          {((item.totalAmount / summary.totalSales) * 100).toFixed(1)}% del total
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Button */}
            <div className="flex justify-end">
              <Button
                type="primary"
                size="large"
                icon={<WhatsAppOutlined />}
                onClick={handleWhatsAppShare}
                className="bg-[#25D366] hover:bg-[#20BA5A] border-none shadow-lg"
              >
                Compartir por WhatsApp
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
