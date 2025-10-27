import { Input, Select, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { SortOrder } from '@/types'

interface ProductFiltersProps {
  searchTerm: string
  sortBy: string
  order: SortOrder
  onSearchChange: (value: string) => void
  onSortByChange: (value: string) => void
  onOrderChange: (value: SortOrder) => void
  onAddProduct: () => void
}

export const ProductFilters = ({
  searchTerm,
  sortBy,
  order,
  onSearchChange,
  onSortByChange,
  onOrderChange,
  onAddProduct,
}: ProductFiltersProps) => {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <Input
        placeholder="Buscar por nombre o SKU..."
        allowClear
        prefix={<SearchOutlined />}
        size="large"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-md"
      />

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Ordenar por:</span>
        <Select
          value={sortBy}
          onChange={onSortByChange}
          options={[
            { label: 'Fecha de creación', value: 'createdAt' },
            { label: 'Fecha de actualización', value: 'updatedAt' },
            { label: 'Nombre', value: 'name' },
            { label: 'Estado', value: 'isActive' },
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
      <Button type="primary" onClick={onAddProduct} className="ml-auto">
        Agregar Producto
      </Button>
    </div>
  )
}
