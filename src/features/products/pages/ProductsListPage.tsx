import { useMemo, useState } from 'react'
import { Button, Popconfirm, Table, Tag } from 'antd'
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
import { dateFormat } from '@/utils/dateFormat'

type Option = { id: number; name: string }
type TableRecord = ProductResponse

export const ProductsListPage = () => {
  const { data: products, isLoading, error } = useProducts()
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
      { title: 'Name', dataIndex: 'name', key: 'name' },
      {
        title: 'Base unit',
        dataIndex: 'baseUnitId',
        key: 'baseUnitId',
        render: (id: number) => options.units.find((u) => u.id === id)?.name || '-',
      },
      {
        title: 'Active',
        dataIndex: 'isActive',
        key: 'isActive',
        render: (v: boolean) =>
          v ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
      },
      {
        title: 'Created',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (d?: string) => (d ? dateFormat(d) : ''),
      },
      {
        title: 'Actions',
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
              Edit
            </Button>
            <Popconfirm
              title="Delete product"
              description="Are you sure to delete this product?"
              okButtonProps={{ danger: true }}
              onConfirm={() => deleteMutation.mutate(record.id)}
            >
              <Button danger size="small">
                Delete
              </Button>
            </Popconfirm>
          </div>
        ),
      },
    ],
    [options, deleteMutation],
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error instanceof Error ? error.message : 'Error loading'}</div>

  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <Button
          type="primary"
          onClick={() => {
            setMode('create')
            setEditing(undefined)
            setOpen(true)
          }}
        >
          Add Product
        </Button>
      </div>

      <Table<TableRecord>
        rowKey="id"
        loading={isLoading}
        dataSource={products || []}
        columns={columns}
        bordered
        className="bg-white rounded-lg"
      />

      <ProductFormModal
        open={open}
        mode={mode}
        initialProduct={editing}
        onClose={() => setOpen(false)}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        options={options}
        onSubmit={(values: CreateProductDto) => {
          const onSuccess = () => setOpen(false)
          if (mode === 'create') createMutation.mutate(values, { onSuccess })
          else if (editing) updateMutation.mutate({ id: editing.id, dto: values }, { onSuccess })
        }}
      />
    </div>
  )
}
