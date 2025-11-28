import { Modal, DatePicker, Spin, Button, Empty } from 'antd'
import { WhatsAppOutlined, CalendarOutlined, ShoppingOutlined } from '@ant-design/icons'
import { useState } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import { useDailySummary } from '../queries'
import { formatCurrency, dateFormat } from '@/utils'
import { SummaryCards, ItemsList } from './DailySummarySections'

interface DailySummaryModalProps {
  open: boolean
  onClose: () => void
}

const generateWhatsAppMessage = (summary: {
  date: string
  totalSales: number
  totalTickets: number
  items: Array<{
    productName: string
    cutName: string | null
    quantity: number
    unit: string
    totalAmount: number
  }>
}) => {
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

export const DailySummaryModal = ({ open, onClose }: DailySummaryModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())
  const { data: summary, isLoading } = useDailySummary(selectedDate.toISOString())

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  const handleWhatsAppShare = () => {
    if (!summary) return
    const message = generateWhatsAppMessage(summary)
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
            <SummaryCards totalSales={summary.totalSales} totalTickets={summary.totalTickets} />
            <ItemsList items={summary.items} totalSales={summary.totalSales} />

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
