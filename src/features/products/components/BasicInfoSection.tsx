import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import { Input, InputNumber, Select } from 'antd'
import {
  ShoppingOutlined,
  BarcodeOutlined,
  TagsOutlined,
  DollarOutlined,
  FileTextOutlined,
  PictureOutlined,
} from '@ant-design/icons'
import { CloudinaryUploadWidget } from '@/components/CloudinaryUploadWidget'
import type { ProductFormOptions } from './ProductForm'
import type { z } from 'zod'
import type { productSchema } from '../types'

type ProductFormValues = z.input<typeof productSchema>

type BasicInfoSectionProps = {
  control: Control<ProductFormValues>
  errors: FieldErrors<ProductFormValues>
  options: ProductFormOptions
}

export const BasicInfoSection = ({ control, errors, options }: BasicInfoSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Product Name */}
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

      {/* SKU */}
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

      {/* Barcode */}
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

      {/* Image Upload */}
      <div className="lg:col-span-2 flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <PictureOutlined className="text-gray-400" />
          Imagen del Producto
        </label>
        <Controller
          control={control}
          name="imageUrl"
          render={({ field }) => <CloudinaryUploadWidget value={field.value} onChange={field.onChange} />}
        />
        {errors.imageUrl && (
          <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <span className="text-red-400">⚠</span>
            {errors.imageUrl.message as string}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="lg:col-span-2 flex flex-col gap-2">
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

      {/* Description */}
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

      {/* Pricing */}
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
                  step={1}
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
                  step={1}
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

      {/* Price Notice */}
      <div className="lg:col-span-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700 flex items-center gap-2">
          <span className="text-red-500">*</span>
          <span>Al menos uno de los precios es obligatorio</span>
        </p>
      </div>
    </div>
  )
}
