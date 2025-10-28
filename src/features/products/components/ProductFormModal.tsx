import { Modal } from 'antd'
import { ProductForm, type ProductFormOptions } from './ProductForm'
import type { CreateProductDto, Product } from '../types'

export type ProductFormModalMode = 'create' | 'edit'

type Props = {
  open: boolean
  mode: ProductFormModalMode
  initialProduct?: Product
  onClose: () => void
  onSubmit: (values: CreateProductDto) => void
  isSubmitting?: boolean
  options: ProductFormOptions
}

export const ProductFormModal = ({
  open,
  mode,
  initialProduct,
  onClose,
  onSubmit,
  isSubmitting,
  options,
}: Props) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={mode === 'create' ? 'Agregar producto' : 'Editar producto'}
      footer={null}
      width={700}
    >
      <ProductForm
        defaultValues={initialProduct}
        onSubmit={onSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
        options={options}
      />
    </Modal>
  )
}
