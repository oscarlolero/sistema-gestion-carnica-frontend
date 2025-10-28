import type { PosProduct } from '../constants/mockData'

type PosProductCardProps = {
  product: PosProduct
  onAdd: (productId: string) => void
}

export const PosProductCard = ({ product, onAdd }: PosProductCardProps) => {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
      <div className="relative h-40 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {product.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-[#b22222] px-3 py-1 text-xs font-semibold text-white shadow-lg">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-[#2d2d2d]">{product.name}</h3>
            <p className="text-sm text-[#8c8c8c]">{product.unit}</p>
          </div>
          <span className="rounded-full bg-[#fdf0ed] px-3 py-1 text-sm font-semibold text-[#b22222]">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAdd(product.id)}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#b22222] py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#921c1c]"
        >
          <span>Agregar</span>
        </button>
      </div>
    </div>
  )
}
