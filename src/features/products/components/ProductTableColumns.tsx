import { Button, Popconfirm, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { ProductResponse } from '../types'
import { dateFormat } from '@/utils'

type Option = { id: number; name: string }
type TableRecord = ProductResponse

interface ProductTableColumnsProps {
  options: {
    units: Option[]
    categories: Option[]
    cuts: Option[]
  }
  onEdit: (record: TableRecord) => void
  onDelete: (id: number) => void
}

export const createProductColumns = ({
  options,
  onEdit,
  onDelete,
}: ProductTableColumnsProps): ColumnsType<TableRecord> => [
  { title: 'Nombre', dataIndex: 'name', key: 'name' },
  { title: 'SKU', dataIndex: 'sku', key: 'sku', render: (sku: string) => sku || '-' },
  {
    title: 'Categoría',
    dataIndex: 'categories',
    key: 'categories',
    render: (categories: { categoryId: number }[]) => {
      if (!categories || categories.length === 0) return '-'
      const categoryNames = categories
        .map((cat) => options.categories.find((c) => c.id === cat.categoryId)?.name)
        .filter(Boolean)
        .join(', ')
      return categoryNames || '-'
    },
  },
  {
    title: 'Unidad Base',
    dataIndex: 'baseUnitId',
    key: 'baseUnitId',
    render: (id: number) => options.units.find((u) => u.id === id)?.name || '-',
  },
  {
    title: 'Estado',
    dataIndex: 'isActive',
    key: 'isActive',
    render: (v: boolean) => (v ? <Tag color="green">Activo</Tag> : <Tag color="red">Inactivo</Tag>),
  },
  {
    title: 'Creado',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (d?: string) => (d ? dateFormat(d) : ''),
  },
  {
    title: 'Actualizado',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: (d?: string) => (d ? dateFormat(d) : ''),
  },
  {
    title: 'Acciones',
    key: 'actions',
    render: (_: unknown, record: TableRecord) => (
      <div className="flex items-center gap-2">
        <Button size="small" onClick={() => onEdit(record)}>
          Editar
        </Button>
        <Popconfirm
          title="Eliminar producto"
          description="¿Estás seguro de que quieres eliminar este producto?"
          okButtonProps={{ danger: true }}
          onConfirm={() => onDelete(record.id)}
        >
          <Button danger size="small">
            Eliminar
          </Button>
        </Popconfirm>
      </div>
    ),
  },
]
