import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, Space, Switch, Typography } from 'antd'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { productSchema, type CreateProductDto, type Product } from '../types'
import { z } from 'zod'
import { useEffect } from 'react'
import { ShoppingOutlined, SettingOutlined } from '@ant-design/icons'
import { BasicInfoSection } from './BasicInfoSection'
import { CutsSection } from './CutsSection'

export type ProductFormOptions = {
  categories: { id: number; name: string }[]
  cuts: { id: number; name: string }[]
}

type Props = {
  defaultValues?: Partial<Product>
  onSubmit: (values: CreateProductDto) => void
  onCancel?: () => void
  isSubmitting?: boolean
  options: ProductFormOptions
}

type ProductFormValues = z.input<typeof productSchema>

const fallbackDefaults: ProductFormValues = {
  id: undefined as unknown as number,
  name: '',
  description: null,
  sku: null,
  barcode: null,
  imageUrl: null,
  pricePerKg: null,
  pricePerUnit: null,
  isActive: true,
  categories: [],
  cuts: [],
}

export const ProductForm = ({ defaultValues, onSubmit, onCancel, isSubmitting, options }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { ...fallbackDefaults, ...(defaultValues as Partial<ProductFormValues>) },
    mode: 'onSubmit',
  })

  // Reset form when defaultValues change
  useEffect(() => {
    const newValues = { ...fallbackDefaults, ...(defaultValues as Partial<ProductFormValues>) }
    reset(newValues)
  }, [defaultValues, reset])

  const { fields, append, remove } = useFieldArray({ control, name: 'cuts' })

  const submitHandler = (values: ProductFormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _omitId, ...rest } = values as Product
    const dto: CreateProductDto = rest
    onSubmit(dto)
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
      {/* Basic Information Card */}
      <Card
        title={
          <div className="flex items-center justify-between">
            <Space>
              <ShoppingOutlined className="text-blue-500" />
              <Typography.Text strong>Información Básica</Typography.Text>
            </Space>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <Switch {...field} checked={!!field.value} checkedChildren="Activo" unCheckedChildren="Inactivo" />
              )}
            />
          </div>
        }
        className="shadow-sm border-0"
      >
        <BasicInfoSection control={control} errors={errors} options={options} />
      </Card>

      {/* Cuts Section Card */}
      <Card
        title={
          <Space>
            <SettingOutlined className="text-purple-500" />
            <Typography.Text strong>Cortes del Producto</Typography.Text>
          </Space>
        }
        className="shadow-sm border-0 bg-linear-to-r from-purple-50/30 to-pink-50/30"
      >
        <CutsSection control={control} fields={fields} append={append} remove={remove} options={options} />
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button htmlType="button" onClick={onCancel} size="large" className="px-6">
          Cancelar
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          size="large"
          className="px-8 bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
        </Button>
      </div>
    </form>
  )
}
