import { Input, Select, DatePicker } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { SortOrder } from '@/types'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

interface TicketFiltersProps {
  searchTerm: string
  sortBy: 'date' | 'createdAt' | 'updatedAt' | 'total'
  order: SortOrder
  onSearchChange: (value: string) => void
  onSortByChange: (value: 'date' | 'createdAt' | 'updatedAt' | 'total') => void
  onOrderChange: (value: SortOrder) => void
  onDateRangeChange: (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => void
}

export const TicketFilters = ({
  searchTerm,
  sortBy,
  order,
  onSearchChange,
  onSortByChange,
  onOrderChange,
  onDateRangeChange,
}: TicketFiltersProps) => {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <Input
        placeholder="Buscar por tipo de pago o producto..."
        allowClear
        prefix={<SearchOutlined />}
        size="large"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-md"
      />

      <RangePicker
        onChange={onDateRangeChange}
        format="DD/MM/YYYY"
        placeholder={['Fecha inicial', 'Fecha final']}
        className="min-w-64"
      />

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Ordenar por:</span>
        <Select
          value={sortBy}
          onChange={onSortByChange}
          options={[
            { label: 'Fecha', value: 'date' },
            { label: 'Total', value: 'total' },
            { label: 'Fecha de creación', value: 'createdAt' },
            { label: 'Fecha de actualización', value: 'updatedAt' },
          ]}
          className="min-w-40"
        />
        <Select
          value={order}
          onChange={onOrderChange}
          options={[
            { label: 'Ascendente', value: 'asc' },
            { label: 'Descendente', value: 'desc' },
          ]}
          className="min-w-32"
        />
      </div>
    </div>
  )
}
