import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Divider, Input, InputNumber, Select, Switch } from 'antd'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { productSchema, type CreateProductDto, type Product } from '../types'
import { z } from 'zod'

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

export const ProductForm = ({ defaultValues, onSubmit, isSubmitting, options }: Props) => {
  const fallbackDefaults: ProductFormValues = {
    id: undefined as unknown as number,
    name: '',
    description: null,
    barcode: null,
    pricePerKg: null,
    pricePerUnit: null,
    isActive: true,
    baseUnitId: 0,
    categories: [],
    cuts: [],
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { ...fallbackDefaults, ...(defaultValues as Partial<ProductFormValues>) },
    mode: 'onSubmit',
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'cuts' })

  const submitHandler = (values: ProductFormValues) => {
    const { id: _omitId, ...rest } = values as Product
    const dto: CreateProductDto = rest
    onSubmit(dto)
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(submitHandler)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Name</label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => <Input {...field} className="h-10" placeholder="Name" />}
          />
          {errors.name && (
            <span className="text-red-600 text-sm">{errors.name.message as string}</span>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col flex-1 gap-1">
            <label className="text-sm text-gray-600">Base unit</label>
            <Controller
              control={control}
              name="baseUnitId"
              render={({ field }) => (
                <Select
                  {...field}
                  className="w-full"
                  placeholder="Select unit"
                  options={options.units.map((u) => ({ value: u.id, label: u.name }))}
                  value={field.value || undefined}
                />
              )}
            />
            {errors.baseUnitId && (
              <span className="text-red-600 text-sm">{errors.baseUnitId.message as string}</span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-6">
            <label className="text-sm text-gray-600">Active</label>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => <Switch {...field} checked={!!field.value} />}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Barcode</label>
          <Controller
            control={control}
            name="barcode"
            render={({ field }) => (
              <Input {...field} value={field.value ?? ''} className="h-10" placeholder="Barcode" />
            )}
          />
          {errors.barcode && (
            <span className="text-red-600 text-sm">{errors.barcode.message as string}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Categories</label>
          <Controller
            control={control}
            name="categories"
            render={({ field }) => (
              <Select
                mode="multiple"
                className="w-full"
                placeholder="Select categories"
                options={options.categories.map((c) => ({ value: c.id, label: c.name }))}
                onChange={(ids) => field.onChange(ids.map((id: number) => ({ categoryId: id })))}
                value={(field.value || []).map((c: { categoryId: number }) => c.categoryId)}
              />
            )}
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-1">
          <label className="text-sm text-gray-600">Description</label>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Input.TextArea
                {...field}
                value={field.value ?? ''}
                rows={3}
                placeholder="Description"
              />
            )}
          />
          {errors.description && (
            <span className="text-red-600 text-sm">{errors.description.message as string}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Price per Kg</label>
          <Controller
            control={control}
            name="pricePerKg"
            render={({ field }) => (
              <InputNumber {...field} min={0} step={0.01} className="w-full" placeholder="0.00" />
            )}
          />
          {errors.pricePerKg && (
            <span className="text-red-600 text-sm">{errors.pricePerKg.message as string}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Price per Unit</label>
          <Controller
            control={control}
            name="pricePerUnit"
            render={({ field }) => (
              <InputNumber {...field} min={0} step={0.01} className="w-full" placeholder="0.00" />
            )}
          />
          {errors.pricePerUnit && (
            <span className="text-red-600 text-sm">{errors.pricePerUnit.message as string}</span>
          )}
        </div>
      </div>

      <Divider orientation="left">Cuts</Divider>

      <div className="flex flex-col gap-3">
        {fields.length === 0 && (
          <div className="text-gray-500 text-sm">No cuts added. Add at least one if needed.</div>
        )}
        {fields.map((fieldItem, idx) => (
          <div key={fieldItem.id} className="grid grid-cols-1 md:grid-cols-4 items-center gap-3">
            <Controller
              control={control}
              name={`cuts.${idx}.cutId` as const}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select cut"
                  options={options.cuts.map((c) => ({ value: c.id, label: c.name }))}
                  value={field.value || undefined}
                />
              )}
            />
            <Controller
              control={control}
              name={`cuts.${idx}.pricePerKg` as const}
              render={({ field }) => (
                <InputNumber {...field} min={0} step={0.01} className="w-full" placeholder="0.00" />
              )}
            />
            <Controller
              control={control}
              name={`cuts.${idx}.pricePerUnit` as const}
              render={({ field }) => (
                <InputNumber {...field} min={0} step={0.01} className="w-full" placeholder="0.00" />
              )}
            />
            <Button danger onClick={() => remove(idx)} className="w-full md:w-auto">
              Remove
            </Button>
          </div>
        ))}
        <div>
          <Button
            type="dashed"
            onClick={() => append({ cutId: 0, pricePerKg: null, pricePerUnit: null })}
          >
            Add cut
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button htmlType="button" onClick={() => window.history.back()} className="shrink-0">
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={isSubmitting} className="shrink-0">
          Save
        </Button>
      </div>
    </form>
  )
}
