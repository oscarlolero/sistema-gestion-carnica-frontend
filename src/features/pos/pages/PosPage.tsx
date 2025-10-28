import { useMemo, useState } from 'react'
import { PosCategoryFilter, PosProductGrid, PosSearchBar, PosTicketSummary } from '../components'
import { useProducts, useCategories } from '@/features/products/queries'
import type { CartItem, PaymentType } from '../types'
import type { ProductResponse } from '@/features/products/types'

export const PosPage = () => {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all')
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentType, setPaymentType] = useState<PaymentType>('cash')

  // Fetch products and categories from backend
  const { data: productsData, isLoading: productsLoading } = useProducts({ page: 1, limit: 1000 })
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories()

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
        activeCategory === 'all'
          ? true
          : product.categories?.some((cat) => cat.categoryId === activeCategory)
      const matchesSearch = normalizedSearch
        ? product.name.toLowerCase().includes(normalizedSearch)
        : true
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, search, productsData?.data])

  // Add product to cart
  const handleAddToCart = (product: ProductResponse, cutId?: number) => {
    const cut = cutId ? product.cuts?.find((c) => c.cutId === cutId) : undefined
    const rawPrice = cut
      ? (cut.pricePerKg ?? cut.pricePerUnit ?? 0)
      : (product.pricePerKg ?? product.pricePerUnit ?? 0)
    const unitPrice = typeof rawPrice === 'string' ? Number(rawPrice) : (rawPrice ?? 0)

    const cartItemId = cutId ? `${product.id}-${cutId}` : `${product.id}`

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === cartItemId)

      if (existingItem) {
        // Increment quantity
        return prevCart.map((item) =>
          item.id === cartItemId
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.unitPrice,
              }
            : item,
        )
      }

      // Add new item
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        productName: product.name,
        cutId,
        cutName: cutId ? `Corte #${cutId}` : undefined,
        quantity: 1,
        unitPrice,
        subtotal: unitPrice,
        unit: product.pricePerKg ? 'kg' : 'ud',
      }

      return [...prevCart, newItem]
    })
  }

  // Update cart item quantity
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity, subtotal: quantity * item.unitPrice } : item,
        ),
      )
    }
  }

  // Remove item from cart
  const handleRemoveItem = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
  }

  // Clear cart
  const handleClearCart = () => {
    setCart([])
  }

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

      <div className="hidden w-[360px] shrink-0 xl:block">
        <PosTicketSummary
          items={cart}
          paymentType={paymentType}
          onPaymentTypeChange={setPaymentType}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
        />
      </div>
    </div>
  )
}
