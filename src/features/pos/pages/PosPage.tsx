import { useMemo, useState } from 'react'
import { PosCategoryFilter, PosProductGrid, PosSearchBar, PosTicketSummary } from '../components'
import { useProducts, useCategories } from '@/features/products/queries'
import { useUsers } from '@/features/users/queries'
import { useClients } from '@/features/clients/queries'
import { useCart } from '../hooks/useCart'

export const PosPage = () => {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all')

  // Fetch products, categories, and users from backend
  const { data: productsData, isLoading: productsLoading } = useProducts({ page: 1, limit: 1000 })
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories()
  const { data: usersData } = useUsers()
  const { data: clientsData } = useClients()

  // Cart management
  const {
    cart,
    paymentType,
    setPaymentType,
    selectedUserId,
    setSelectedUserId,
    selectedClientId,
    setSelectedClientId,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
  } = useCart()

  // Prepare categories for filter (add 'all' option)
  const categoryOptions = useMemo(
    () => [
      { id: 'all' as const, name: 'Todas' },
      ...(categoriesData ?? []).map((cat: { id: number; name: string }) => ({
        id: cat.id,
        name: cat.name,
      })),
    ],
    [categoriesData],
  )

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    const products = productsData?.data ?? []
    const normalizedSearch = search.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === 'all' ? true : product.categories?.some((cat) => cat.categoryId === activeCategory)
      const matchesSearch = normalizedSearch ? product.name.toLowerCase().includes(normalizedSearch) : true
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, search, productsData?.data])

  const isLoading = productsLoading || categoriesLoading

  return (
    <div className="flex h-full gap-6">
      <div className="flex h-full flex-1 flex-col gap-6 overflow-hidden">
        <div className="space-y-4">
          <PosSearchBar value={search} onChange={setSearch} />
          <PosCategoryFilter
            categories={categoryOptions}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        <section className="flex-1 overflow-y-auto rounded-3xl bg-[#fff8f0] p-6 shadow-inner">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-[#8c8c8c]">Cargando productos...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <header className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#2d2d2d]">
                  {activeCategory === 'all'
                    ? 'Todos los productos'
                    : categoryOptions.find((category) => category.id === activeCategory)?.name}
                </h2>
                <span className="text-sm text-[#8c8c8c]">{filteredProducts.length} productos</span>
              </header>

              <PosProductGrid products={filteredProducts} onAdd={handleAddToCart} />
            </div>
          )}
        </section>
      </div>

      <div className="w-[280px] md:w-[320px] xl:w-[360px] shrink-0">
        <PosTicketSummary
          items={cart}
          paymentType={paymentType}
          onPaymentTypeChange={setPaymentType}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          users={usersData ?? []}
          selectedUserId={selectedUserId}
          onUserChange={setSelectedUserId}
          clients={clientsData ?? []}
          selectedClientId={selectedClientId}
          onClientChange={setSelectedClientId}
        />
      </div>
    </div>
  )
}
