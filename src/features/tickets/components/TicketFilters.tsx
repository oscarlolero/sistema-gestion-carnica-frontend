import { Select, DatePicker } from 'antd'
import type { SortOrder } from '@/types'
import dayjs from 'dayjs'
import { useProducts } from '@/features/products/queries'

const { RangePicker } = DatePicker

interface TicketFiltersProps {
  selectedProducts: number[]
  sortBy: 'date' | 'createdAt' | 'updatedAt' | 'total'
  order: SortOrder
  onProductsChange: (value: number[]) => void
  onSortByChange: (value: 'date' | 'createdAt' | 'updatedAt' | 'total') => void
  onOrderChange: (value: SortOrder) => void
  onDateRangeChange: (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => void
}

export const TicketFilters = ({
  selectedProducts,
  sortBy,
  order,
  onProductsChange,
  onSortByChange,
  onOrderChange,
  onDateRangeChange,
}: TicketFiltersProps) => {
  const { data: productsResponse, isLoading: isLoadingProducts } = useProducts({
    page: 1,
    limit: 1000,
    includeInactive: false,
  })
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <Select
        mode="multiple"
        placeholder="Filtrar por productos..."
        allowClear
        showSearch
        value={selectedProducts}
        onChange={onProductsChange}
        loading={isLoadingProducts}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={productsResponse?.data.map((product) => ({
          label: product.name,
          value: product.id,
        }))}
        className="max-w-md min-w-64"
        maxTagCount="responsive"
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
