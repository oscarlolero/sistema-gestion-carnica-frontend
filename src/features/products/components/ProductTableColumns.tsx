import { Button, Popconfirm, Tag, Image } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { ProductResponse } from '../types'
import { dateFormat } from '@/utils'

type Option = { id: number; name: string }
type TableRecord = ProductResponse

interface ProductTableColumnsProps {
  options: {
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
  {
    title: 'Imagen',
    dataIndex: 'imageUrl',
    key: 'imageUrl',
    width: 80,
    render: (imageUrl: string, record: TableRecord) => {
      if (!imageUrl) {
        return (
          <div className="flex h-[50px] w-[50px] items-center justify-center rounded bg-gray-100 text-gray-400">
            <span className="text-xs">Sin imagen</span>
          </div>
        )
      }

      // Generate thumbnail URL with Cloudinary transformations
      const getThumbnailUrl = (url: string) => {
        if (!url.includes('cloudinary.com')) return url

        // Insert transformation parameters before /upload/
        return url.replace('/upload/', '/upload/c_thumb,w_50,h_50,g_face,f_auto,q_auto/')
      }

      const thumbnailUrl = getThumbnailUrl(imageUrl)

      return (
        <Image
          src={thumbnailUrl}
          alt={record.name}
          width={50}
          height={50}
          style={{ objectFit: 'cover', borderRadius: '4px' }}
          preview={{ src: imageUrl, mask: 'Ver' }}
        />
      )
    },
  },
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
