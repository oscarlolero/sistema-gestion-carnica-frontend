import { useMemo, useState } from 'react'
import { posCategories, posProducts, posTicketItems } from '../constants/mockData'
import { PosCategoryFilter, PosProductGrid, PosSearchBar, PosTicketSummary } from '../components'

export const PosPage = () => {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(posCategories[0]?.id ?? 'all')

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return posProducts.filter((product) => {
      const matchesCategory =
        activeCategory === 'all' ? true : product.categoryId === activeCategory
      const matchesSearch = normalizedSearch
        ? product.name.toLowerCase().includes(normalizedSearch)
        : true
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, search])

  return (
    <div className="flex h-full gap-6">
      <div className="flex h-full flex-1 flex-col gap-6 overflow-hidden">
        <div className="space-y-4">
          <PosSearchBar value={search} onChange={setSearch} />
          <PosCategoryFilter
            categories={posCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        <section className="flex-1 overflow-y-auto rounded-3xl bg-[#fff8f0] p-6 shadow-inner">
          <div className="space-y-4">
            <header className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#2d2d2d]">
                {activeCategory === 'all'
                  ? 'Destacados'
                  : posCategories.find((category) => category.id === activeCategory)?.label}
              </h2>
              <span className="text-sm text-[#8c8c8c]">{filteredProducts.length} productos</span>
            </header>

            <PosProductGrid products={filteredProducts} onAdd={() => {}} />
          </div>
        </section>
      </div>

      <div className="hidden w-[360px] shrink-0 xl:block">
        <PosTicketSummary items={posTicketItems} />
      </div>
    </div>
  )
}
