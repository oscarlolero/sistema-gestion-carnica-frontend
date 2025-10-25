import { getProducts } from '@/api/modules/products.api'
import { useQuery } from '@tanstack/react-query'

const PRODUCTS_KEY = 'products'

export const useProducts = () =>
  useQuery({
    queryKey: [PRODUCTS_KEY],
    queryFn: getProducts,
  })
