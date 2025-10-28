import type { PosCategory } from '../constants/mockData'

type PosCategoryFilterProps = {
  categories: PosCategory[]
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

export const PosCategoryFilter = ({
  categories,
  activeCategory,
  onCategoryChange,
}: PosCategoryFilterProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((category) => {
        const isActive = category.id === activeCategory

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryChange(category.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 shadow-sm border border-transparent hover:border-[#b22222]/20 focus:outline-none focus:ring-2 focus:ring-[#b22222]/30 ${
              isActive
                ? 'bg-[#b22222] text-white shadow-[0_8px_16px_rgba(178,34,34,0.25)]'
                : 'bg-white text-[#4A4A4A]'
            }`}
          >
            {category.label}
          </button>
        )
      })}
    </div>
  )
}
