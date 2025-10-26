import { client } from '../client'
import {
  ProductListResponse,
  CreateProductDto,
  UpdateProductDto,
  ProductResponse,
} from '@/features/products/types'
import { PaginationParams } from '@/types'

// GET /products
export const getProducts = async (
  params: PaginationParams = { page: 1, limit: 10 },
): Promise<ProductListResponse> => {
  const { page = 1, limit = 10 } = params
  const res = await client.get(`/products?include=categories,cuts&page=${page}&limit=${limit}`)
  return res.data
}

// POST /products
export const createProduct = async (data: CreateProductDto): Promise<ProductResponse> => {
  const res = await client.post('/products', data)
  return res.data
}

// PATCH /products/:id
export const updateProduct = async (
  id: number,
  data: UpdateProductDto,
): Promise<ProductResponse> => {
  const res = await client.patch(`/products/${id}`, data)
  return res.data
}

// DELETE /products/:id
export const deleteProduct = async (id: number): Promise<ProductResponse> => {
  const res = await client.delete(`/products/${id}`)
  return res.data
}

// GET /products/cuts
export const getProductCuts = async () => {
  const res = await client.get('/products/cuts')
  return res.data
}

// GET /products/categories
export const getCategories = async () => {
  const res = await client.get('/products/categories')
  return res.data
}

// GET /products/units
export const getUnits = async () => {
  const res = await client.get('/products/units')
  return res.data
}
