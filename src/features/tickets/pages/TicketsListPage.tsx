import { useState, useEffect, useMemo } from 'react'
import { Button, Input, Popconfirm, Table, Tag, Select, DatePicker } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useTickets, useDeleteTicket } from '../queries'
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
  const [dateRange, setDateRange] = useState<[string | undefined, string | undefined]>([
    undefined,
    undefined,
  ])

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, sortBy, order, dateRange])

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
    startDate: dateRange[0],
    endDate: dateRange[1],
  })

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
    [deleteMutation],
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
            <div className="p-6 bg-[#F8F3ED]">
              <div className="mb-4 pb-3 border-b-2 border-[#B22222]">
                <h4 className="text-lg font-semibold text-[#2C2C2C]">Items del Ticket</h4>
              </div>
              <div className="space-y-3">
                {record.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#E8E8E8] hover:border-[#B22222] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-12 bg-[#B22222] rounded-full" />
                      <div>
                        <div className="font-semibold text-[#2C2C2C]">{item.product.name}</div>
                        {item.cut && (
                          <Tag className="mt-1 bg-[#7D9A6D]/20 text-[#7D9A6D] border-[#7D9A6D]/30">
                            {item.cut.name}
                          </Tag>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[#555555] mb-1">
                        {item.quantity} x {formatCurrency(item.unitPrice)}
                      </div>
                      <div className="text-lg font-bold text-[#B22222]">
                        {formatCurrency(item.subtotal)}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t-2 border-[#E8E8E8]">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-[#2C2C2C]">Total del Ticket</div>
                    <div className="text-xl font-bold text-[#B22222]">
                      {formatCurrency(record.total)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ),
          rowExpandable: () => true,
        }}
      />
    </div>
  )
}
