import { Button, Popconfirm, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TicketResponse } from '../types'
import { dateFormat, formatCurrency } from '@/utils'

type TicketTableRecord = TicketResponse

interface TicketTableColumnsProps {
  onDelete: (id: number) => void
}

export const createTicketColumns = ({
  onDelete,
}: TicketTableColumnsProps): ColumnsType<TicketTableRecord> => [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: 'Fecha',
    dataIndex: 'date',
    key: 'date',
    render: (date: string) => dateFormat(date),
  },
  {
    title: 'Tipo de Pago',
    dataIndex: 'paymentType',
    key: 'paymentType',
    render: (type: string) => <Tag color="blue">{type}</Tag>,
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    render: (total: number | string | { toNumber: () => number }) => formatCurrency(total),
  },
  {
    title: 'Items',
    dataIndex: 'items',
    key: 'items',
    render: (items: TicketResponse['items']) => items.length,
  },
  {
    title: 'Impreso',
    dataIndex: 'printed',
    key: 'printed',
    render: (printed: boolean) => (
      <Tag color={printed ? 'green' : 'red'}>{printed ? 'Sí' : 'No'}</Tag>
    ),
  },
  {
    title: 'Usuario',
    dataIndex: 'user',
    key: 'user',
    render: (user: TicketResponse['user']) => user?.name || '-',
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
    render: (_: unknown, record: TicketTableRecord) => (
      <div className="flex items-center gap-2">
        <Popconfirm
          title="Eliminar ticket"
          description="¿Estás seguro de que quieres eliminar este ticket?"
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
