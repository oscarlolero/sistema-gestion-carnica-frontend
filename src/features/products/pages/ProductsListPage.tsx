import { useMemo, useState, useEffect } from 'react'
import { Button, Input, Popconfirm, Table, Tag, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
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
import type { ProductResponse, CreateProductDto } from '../types'
import { dateFormat, useDebounce } from '@/utils'
import type { SortField, SortOrder } from '@/types'

type Option = { id: number; name: string }
type TableRecord = ProductResponse

export const ProductsListPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortField>('createdAt')
  const [order, setOrder] = useState<SortOrder>('desc')
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
      units: (unitsRaw || []) as Option[],
      categories: (categoriesRaw || []) as Option[],
      cuts: (cutsRaw || []) as Option[],
    }),
    [unitsRaw, categoriesRaw, cutsRaw],
  )

  const columns: ColumnsType<TableRecord> = useMemo(
    () => [
      { title: 'Nombre', dataIndex: 'name', key: 'name' },
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
        render: (v: boolean) =>
          v ? <Tag color="green">Activo</Tag> : <Tag color="red">Inactivo</Tag>,
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
            <Button
              size="small"
              onClick={() => {
                setMode('edit')
                setEditing(record)
                setOpen(true)
              }}
            >
              Editar
            </Button>
            <Popconfirm
              title="Eliminar producto"
              description="¿Estás seguro de que quieres eliminar este producto?"
              okButtonProps={{ danger: true }}
              onConfirm={() =>
                deleteMutation.mutate(record.id, {
                  onSuccess: () => setCurrentPage(1), // Reset to first page after deleting
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
    [options, deleteMutation],
  )

  if (error) return <div>Error: {error instanceof Error ? error.message : 'Error al cargar'}</div>

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchClear = () => {
    setSearchTerm('')
  }

  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Productos</h1>
        <Button
          type="primary"
          onClick={() => {
            setMode('create')
            setEditing(undefined)
            setOpen(true)
          }}
        >
          Agregar Producto
        </Button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <Input
          placeholder="Buscar productos por nombre..."
          allowClear
          prefix={<SearchOutlined />}
          size="large"
          value={searchTerm}
          onChange={handleSearchChange}
          onClear={handleSearchClear}
          className="max-w-md"
        />

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Ordenar por:</span>
          <Select
            value={sortBy}
            onChange={setSortBy}
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
            onChange={setOrder}
            options={[
              { label: 'Ascendente', value: 'asc' },
              { label: 'Descendente', value: 'desc' },
            ]}
            className="min-w-32"
          />
        </div>
      </div>

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
