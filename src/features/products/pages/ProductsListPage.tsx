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
  const [editing, setEditing] = useState<TableRecord | undefined>()

  const units: Option[] = useMemo(() => (unitsRaw || []) as Option[], [unitsRaw])
  const categories: Option[] = useMemo(() => (categoriesRaw || []) as Option[], [categoriesRaw])
  const cuts: Option[] = useMemo(() => (cutsRaw || []) as Option[], [cutsRaw])

  const options = useMemo(
    () => ({
      units: units.map((u: Option) => ({ id: u.id, name: u.name })),
      categories: categories.map((c: Option) => ({ id: c.id, name: c.name })),
      cuts: cuts.map((c: Option) => ({ id: c.id, name: c.name })),
    }),
    [units, categories, cuts],
  )

  const columns: ColumnsType<TableRecord> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Base unit',
      dataIndex: 'baseUnitId',
      key: 'baseUnitId',
      render: (id: number) => options.units.find((u: Option) => u.id === id)?.name || '-',
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
  ]

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
        dataSource={(products || []) as TableRecord[]}
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
          if (mode === 'create') {
            createMutation.mutate(values, { onSuccess: () => setOpen(false) })
          } else if (editing) {
            updateMutation.mutate(
              { id: editing.id, dto: values },
              { onSuccess: () => setOpen(false) },
            )
          }
        }}
      />
    </div>
  )
}
