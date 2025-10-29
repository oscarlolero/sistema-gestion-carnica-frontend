import { useState, useEffect, useMemo } from 'react'
import { Table, Button } from 'antd'
import { BarChartOutlined } from '@ant-design/icons'
import { useTickets, useDeleteTicket } from '../queries'
import { TicketFilters } from '../components/TicketFilters'
import { createTicketColumns } from '../components/TicketTableColumns'
import { TicketExpandedRow } from '../components/TicketExpandedRow'
import { DailySummaryModal } from '../components/DailySummaryModal'
import type { TicketResponse } from '../types'
import { useDebounce } from '@/utils'
import type { SortOrder } from '@/types'
import dayjs from 'dayjs'

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
  const [showDailySummary, setShowDailySummary] = useState(false)

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

  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    if (!dates || !dates[0] || !dates[1]) {
      setDateRange([undefined, undefined])
      return
    }
    setDateRange([dates[0].toISOString(), dates[1].toISOString()])
  }

  const columns = useMemo(
    () =>
      createTicketColumns({
        onDelete: (id) =>
          deleteMutation.mutate(id, {
            onSuccess: () => setCurrentPage(1),
          }),
      }),
    [deleteMutation],
  )

  if (error) {
    return <div>Error: {error instanceof Error ? error.message : 'Error al cargar'}</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <TicketFilters
            searchTerm={searchTerm}
            sortBy={sortBy}
            order={order}
            onSearchChange={setSearchTerm}
            onSortByChange={setSortBy}
            onOrderChange={setOrder}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>
        <Button
          type="primary"
          size="large"
          icon={<BarChartOutlined />}
          onClick={() => setShowDailySummary(true)}
          className="bg-[#B22222] hover:bg-[#8B1A1A] border-none shadow-md"
        >
          Resumen del Día
        </Button>
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
          expandedRowRender: (record) => <TicketExpandedRow ticket={record} />,
          rowExpandable: () => true,
        }}
      />

      <DailySummaryModal open={showDailySummary} onClose={() => setShowDailySummary(false)} />
    </div>
  )
}
