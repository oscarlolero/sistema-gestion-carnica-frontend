import { useState, useEffect, useMemo } from 'react'
import { Button, Input, Popconfirm, Table, Tag, Select, DatePicker, Switch } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useTickets, useUpdateTicket, useDeleteTicket } from '../queries'
import type { TicketResponse } from '../types'
import { dateFormat, useDebounce, formatCurrency } from '@/utils'
import type { SortOrder } from '@/types'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

type TicketTableRecord = TicketResponse

export const TicketsListPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'createdAt' | 'updatedAt' | 'total'>('date')
  const [order, setOrder] = useState<SortOrder>('desc')
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>('')
  const [printedFilter, setPrintedFilter] = useState<boolean | undefined>(undefined)
  const [dateRange, setDateRange] = useState<[string | undefined, string | undefined]>([
    undefined,
    undefined,
  ])

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, sortBy, order, paymentTypeFilter, printedFilter, dateRange])

  const {
    data: ticketsResponse,
    isLoading,
    error,
  } = useTickets({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearchTerm || undefined,
    sortBy,
    order,
    paymentType: paymentTypeFilter || undefined,
    printed: printedFilter,
    startDate: dateRange[0],
    endDate: dateRange[1],
  })

  const updateMutation = useUpdateTicket()
  const deleteMutation = useDeleteTicket()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchClear = () => {
    setSearchTerm('')
  }

  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    if (!dates || !dates[0] || !dates[1]) {
      setDateRange([undefined, undefined])
      return
    }
    setDateRange([dates[0].toISOString(), dates[1].toISOString()])
  }

  const columns: ColumnsType<TicketTableRecord> = useMemo(
    () => [
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
        render: (printed: boolean, record: TicketTableRecord) => (
          <Switch
            checked={printed}
            onChange={(checked) =>
              updateMutation.mutate({
                id: record.id,
                dto: { printed: checked },
              })
            }
          />
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
              onConfirm={() =>
                deleteMutation.mutate(record.id, {
                  onSuccess: () => setCurrentPage(1),
                })
              }
            >
              <Button danger size="small">
                Eliminar
              </Button>
            </Popconfirm>
          </div>
        ),
      },
    ],
    [updateMutation, deleteMutation],
  )

  if (error) {
    return <div>Error: {error instanceof Error ? error.message : 'Error al cargar'}</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 flex-wrap">
        <Input
          placeholder="Buscar por tipo de pago o producto..."
          allowClear
          prefix={<SearchOutlined />}
          size="large"
          value={searchTerm}
          onChange={handleSearchChange}
          onClear={handleSearchClear}
          className="max-w-md"
        />

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Tipo de pago:</span>
          <Select
            value={paymentTypeFilter}
            onChange={setPaymentTypeFilter}
            placeholder="Todos"
            allowClear
            className="min-w-32"
            options={[
              { label: 'Efectivo', value: 'Efectivo' },
              { label: 'Tarjeta', value: 'Tarjeta' },
              { label: 'Transferencia', value: 'Transferencia' },
            ]}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Impreso:</span>
          <Select
            value={printedFilter === undefined ? '' : printedFilter ? 'true' : 'false'}
            onChange={(value) => setPrintedFilter(value === '' ? undefined : value === 'true')}
            className="min-w-32"
            options={[
              { label: 'Todos', value: '' },
              { label: 'Sí', value: 'true' },
              { label: 'No', value: 'false' },
            ]}
          />
        </div>

        <RangePicker
          onChange={handleDateRangeChange}
          format="DD/MM/YYYY"
          placeholder={['Fecha inicial', 'Fecha final']}
          className="min-w-64"
        />

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Ordenar por:</span>
          <Select
            value={sortBy}
            onChange={setSortBy}
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
            onChange={setOrder}
            options={[
              { label: 'Ascendente', value: 'asc' },
              { label: 'Descendente', value: 'desc' },
            ]}
            className="min-w-32"
          />
        </div>
      </div>

      <Table<TicketTableRecord>
        rowKey="id"
        loading={isLoading}
        dataSource={ticketsResponse?.data || []}
        columns={columns}
        bordered
        className="bg-white rounded-lg"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: ticketsResponse?.pagination.total || 0,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} tickets`,
          pageSizeOptions: ['10', '20', '50', '100'],
          onChange: (page, size) => {
            setCurrentPage(page)
            setPageSize(size || 10)
          },
        }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="p-4">
              <h4 className="font-semibold mb-2">Items del Ticket</h4>
              <div className="space-y-2">
                {record.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <span className="font-medium">{item.product.name}</span>
                      {item.cut && <Tag className="ml-2">{item.cut.name}</Tag>}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        {item.quantity} x {formatCurrency(item.unitPrice)}
                      </div>
                      <div className="font-semibold">{formatCurrency(item.subtotal)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
          rowExpandable: () => true,
        }}
      />
    </div>
  )
}
