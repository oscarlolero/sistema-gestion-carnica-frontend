import { client } from '../client'
import { ProductListResponse } from '@/features/products/types'

// GET /products
export const getProducts = async (): Promise<ProductListResponse> => {
  const res = await client.get('/products')
  return res.data
}
