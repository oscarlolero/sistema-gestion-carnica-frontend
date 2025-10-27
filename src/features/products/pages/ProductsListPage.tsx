import { useMemo, useState, useEffect } from 'react'
import { Table } from 'antd'
import {
  useCategories,
  useCreateProduct,
  useCuts,
  useDeleteProduct,
  useProducts,
  useUnits,
  useUpdateProduct,
} from '../queries'
import { ProductFormModal } from '../components/ProductFormModal'
import { ProductFilters } from '../components/ProductFilters'
import { createProductColumns } from '../components/ProductTableColumns'
import type { ProductResponse, CreateProductDto } from '../types'
import { useDebounce } from '@/utils'
import type { SortOrder } from '@/types'

type TableRecord = ProductResponse

export const ProductsListPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<string>('name')
  const [order, setOrder] = useState<SortOrder>('asc')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Reset to first page when search term or sorting changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, sortBy, order])

  const {
    data: productsResponse,
    isLoading,
    error,
  } = useProducts({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearchTerm || undefined,
    sortBy,
    order,
  })
  const { data: unitsRaw } = useUnits()
  const { data: categoriesRaw } = useCategories()
  const { data: cutsRaw } = useCuts()

  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [editing, setEditing] = useState<TableRecord>()

  const options = useMemo(
    () => ({
      units: unitsRaw || [],
      categories: categoriesRaw || [],
      cuts: cutsRaw || [],
    }),
    [unitsRaw, categoriesRaw, cutsRaw],
  )

  const columns = useMemo(
    () =>
      createProductColumns({
        options,
        onEdit: (record) => {
          setMode('edit')
          setEditing(record)
          setOpen(true)
        },
        onDelete: (id) =>
          deleteMutation.mutate(id, {
            onSuccess: () => setCurrentPage(1),
          }),
      }),
    [options, deleteMutation],
  )

  if (error) return <div>Error: {error instanceof Error ? error.message : 'Error al cargar'}</div>

  const handleAddProduct = () => {
    setMode('create')
    setEditing(undefined)
    setOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <ProductFilters
        searchTerm={searchTerm}
        sortBy={sortBy}
        order={order}
        onSearchChange={setSearchTerm}
        onSortByChange={setSortBy}
        onOrderChange={setOrder}
        onAddProduct={handleAddProduct}
      />

      <Table<TableRecord>
        rowKey="id"
        loading={isLoading}
        dataSource={productsResponse?.data || []}
        columns={columns}
        bordered
        className="bg-white rounded-lg"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: productsResponse?.pagination.total || 0,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} productos`,
          pageSizeOptions: ['10', '20', '50', '100'],
          onChange: (page, size) => {
            setCurrentPage(page)
            setPageSize(size || 10)
          },
        }}
      />

      <ProductFormModal
        open={open}
        mode={mode}
        initialProduct={editing}
        onClose={() => setOpen(false)}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        options={options}
        onSubmit={(values: CreateProductDto) => {
          const onSuccess = () => {
            setOpen(false)
            setCurrentPage(1) // Reset to first page after creating/updating
          }
          if (mode === 'create') createMutation.mutate(values, { onSuccess })
          else if (editing) updateMutation.mutate({ id: editing.id, dto: values }, { onSuccess })
        }}
      />
    </div>
  )
}
