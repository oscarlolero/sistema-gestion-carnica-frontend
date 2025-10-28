import type { PosProduct } from '../constants/mockData'
import { PosProductCard } from './PosProductCard'

type PosProductGridProps = {
  products: PosProduct[]
  onAdd: (productId: string) => void
}

export const PosProductGrid = ({ products, onAdd }: PosProductGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <PosProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  )
}
