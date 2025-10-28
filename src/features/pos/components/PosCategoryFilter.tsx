import { Button } from 'antd'

type CategoryOption = {
  id: number | 'all'
  name: string
}

type PosCategoryFilterProps = {
  categories: CategoryOption[]
  activeCategory: number | 'all'
  onCategoryChange: (categoryId: number | 'all') => void
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
          <Button
            key={category.id}
            type={isActive ? 'primary' : 'default'}
            onClick={() => onCategoryChange(category.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium h-auto shadow-sm border ${
              isActive
                ? 'bg-[#b22222] border-[#b22222] text-white shadow-[0_8px_16px_rgba(178,34,34,0.25)] hover:bg-[#921c1c] hover:border-[#921c1c] [&.ant-btn-primary]:bg-[#b22222] [&.ant-btn-primary]:border-[#b22222] [&.ant-btn-primary]:hover:bg-[#921c1c] [&.ant-btn-primary]:hover:border-[#921c1c]'
                : 'bg-white border-transparent text-[#4A4A4A] hover:border-[#b22222]/20'
            }`}
          >
            {category.name}
          </Button>
        )
      })}
    </div>
  )
}
