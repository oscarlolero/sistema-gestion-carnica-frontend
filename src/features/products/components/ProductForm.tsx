import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, InputNumber, Select, Switch, Card, Space, Typography } from 'antd'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { productSchema, type CreateProductDto, type Product } from '../types'
import { z } from 'zod'
import { useEffect } from 'react'
import {
  PlusOutlined,
  DeleteOutlined,
  ShoppingOutlined,
  BarcodeOutlined,
  TagsOutlined,
  DollarOutlined,
  SettingOutlined,
  FileTextOutlined,
} from '@ant-design/icons'

export type ProductFormOptions = {
  units: { id: number; name: string }[]
  categories: { id: number; name: string }[]
  cuts: { id: number; name: string }[]
}

type Props = {
  defaultValues?: Partial<Product>
  onSubmit: (values: CreateProductDto) => void
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
  pricePerKg: null,
  pricePerUnit: null,
  isActive: true,
  baseUnitId: 0,
  categories: [],
  cuts: [],
}

export const ProductForm = ({ defaultValues, onSubmit, isSubmitting, options }: Props) => {
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
      {/* Tarjeta de Información Básica */}
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
                <Switch
                  {...field}
                  checked={!!field.value}
                  checkedChildren="Activo"
                  unCheckedChildren="Inactivo"
                />
              )}
            />
          </div>
        }
        className="shadow-sm border-0"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <ShoppingOutlined className="text-gray-400" />
              Nombre del Producto
              <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  size="large"
                  className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
                  placeholder="Ingresa el nombre del producto"
                />
              )}
            />
            {errors.name && (
              <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="text-red-400">⚠</span>
                {errors.name.message as string}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <ShoppingOutlined className="text-gray-400" />
              SKU
            </label>
            <Controller
              control={control}
              name="sku"
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value ?? ''}
                  size="large"
                  className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
                  placeholder="Ingresa el SKU del producto"
                />
              )}
            />
            {errors.sku && (
              <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="text-red-400">⚠</span>
                {errors.sku.message as string}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <BarcodeOutlined className="text-gray-400" />
              Código de Barras
            </label>
            <Controller
              control={control}
              name="barcode"
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value ?? ''}
                  size="large"
                  className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
                  placeholder="Ingresa el código de barras"
                />
              )}
            />
            {errors.barcode && (
              <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="text-red-400">⚠</span>
                {errors.barcode.message as string}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <SettingOutlined className="text-gray-400" />
              Unidad Base
              <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="baseUnitId"
              render={({ field }) => (
                <Select
                  {...field}
                  size="large"
                  className="w-full"
                  placeholder="Selecciona la unidad base"
                  options={options.units.map((u) => ({ value: u.id, label: u.name }))}
                  value={field.value || undefined}
                />
              )}
            />
            {errors.baseUnitId && (
              <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="text-red-400">⚠</span>
                {errors.baseUnitId.message as string}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <TagsOutlined className="text-gray-400" />
              Categorías
            </label>
            <Controller
              control={control}
              name="categories"
              render={({ field }) => (
                <Select
                  mode="multiple"
                  size="large"
                  className="w-full"
                  placeholder="Selecciona las categorías"
                  options={options.categories.map((c) => ({ value: c.id, label: c.name }))}
                  onChange={(ids) => field.onChange(ids.map((id: number) => ({ categoryId: id })))}
                  value={(field.value || []).map((c: { categoryId: number }) => c.categoryId)}
                />
              )}
            />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileTextOutlined className="text-gray-400" />
              Descripción
            </label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  value={field.value ?? ''}
                  rows={3}
                  className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
                  placeholder="Ingresa la descripción del producto"
                />
              )}
            />
            {errors.description && (
              <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="text-red-400">⚠</span>
                {errors.description.message as string}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <DollarOutlined className="text-gray-400" />
                  Precio por Kg
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="pricePerKg"
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      min={0}
                      step={0.01}
                      size="large"
                      className="w-full rounded-lg border-gray-200 hover:border-green-400 focus:border-green-500 transition-colors"
                      placeholder="0.00"
                      addonAfter="$/kg"
                    />
                  )}
                />
                {errors.pricePerKg && (
                  <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span className="text-red-400">⚠</span>
                    {errors.pricePerKg.message as string}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <DollarOutlined className="text-gray-400" />
                  Precio por Unidad
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="pricePerUnit"
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      min={0}
                      step={0.01}
                      size="large"
                      className="w-full rounded-lg border-gray-200 hover:border-green-400 focus:border-green-500 transition-colors"
                      placeholder="0.00"
                      addonAfter="$/unit"
                    />
                  )}
                />
                {errors.pricePerUnit && (
                  <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span className="text-red-400">⚠</span>
                    {errors.pricePerUnit.message as string}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 flex items-center gap-2">
              <span className="text-red-500">*</span>
              <span>Al menos uno de los precios es obligatorio</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Tarjeta de Sección de Cortes */}
      <Card
        title={
          <Space>
            <SettingOutlined className="text-purple-500" />
            <Typography.Text strong>Cortes del Producto</Typography.Text>
          </Space>
        }
        className="shadow-sm border-0 bg-linear-to-r from-purple-50/30 to-pink-50/30"
      >
        <div className="flex flex-col gap-4">
          {fields.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 px-4">
              <SettingOutlined className="text-4xl text-gray-300 mb-2" />
              <p className="text-sm">
                No se han agregado cortes aún. Agrega cortes para definir precios específicos para
                diferentes porciones.
              </p>
            </div>
          )}

          {fields.map((fieldItem, idx) => (
            <Card
              key={fieldItem.id}
              size="small"
              className="bg-white border border-gray-200 hover:border-purple-300 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-gray-600">Tipo de Corte</label>
                  <Controller
                    control={control}
                    name={`cuts.${idx}.cutId` as const}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Selecciona el corte"
                        options={options.cuts.map((c) => ({ value: c.id, label: c.name }))}
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-gray-600">Precio por Kg</label>
                  <Controller
                    control={control}
                    name={`cuts.${idx}.pricePerKg` as const}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        min={0}
                        step={0.01}
                        className="w-full"
                        placeholder="0.00"
                        addonAfter="$"
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-gray-600">Precio por Unidad</label>
                  <Controller
                    control={control}
                    name={`cuts.${idx}.pricePerUnit` as const}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        min={0}
                        step={0.01}
                        className="w-full"
                        placeholder="0.00"
                        addonAfter="$"
                      />
                    )}
                  />
                </div>

                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => remove(idx)}
                  className="w-full md:w-auto"
                >
                  Eliminar
                </Button>
              </div>
            </Card>
          ))}

          <div className="flex justify-center pt-2">
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => append({ cutId: 0, pricePerKg: null, pricePerUnit: null })}
              className="border-purple-300 text-purple-600 hover:border-purple-400 hover:text-purple-700"
            >
              Agregar Nuevo Corte
            </Button>
          </div>
        </div>
      </Card>

      {/* Botones de Acción */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          htmlType="button"
          onClick={() => window.history.back()}
          size="large"
          className="px-6"
        >
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
