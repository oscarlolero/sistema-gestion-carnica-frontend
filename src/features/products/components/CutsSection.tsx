import { Controller, type Control, type UseFieldArrayReturn } from 'react-hook-form'
import { Button, Card, InputNumber, Select } from 'antd'
import { PlusOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons'
import type { ProductFormOptions } from './ProductForm'
import type { z } from 'zod'
import type { productSchema } from '../types'

type ProductFormValues = z.input<typeof productSchema>

type CutsSectionProps = {
  control: Control<ProductFormValues>
  fields: UseFieldArrayReturn<ProductFormValues, 'cuts', 'id'>['fields']
  append: UseFieldArrayReturn<ProductFormValues, 'cuts', 'id'>['append']
  remove: UseFieldArrayReturn<ProductFormValues, 'cuts', 'id'>['remove']
  options: ProductFormOptions
}

export const CutsSection = ({ control, fields, append, remove, options }: CutsSectionProps) => {
  return (
    <div className="flex flex-col gap-4">
      {fields.length === 0 && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 px-4">
          <SettingOutlined className="text-4xl text-gray-300 mb-2" />
          <p className="text-sm">
            No se han agregado cortes aún. Agrega cortes para definir precios específicos para diferentes
            porciones.
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

            <Button danger icon={<DeleteOutlined />} onClick={() => remove(idx)} className="w-full md:w-auto">
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
  )
}
