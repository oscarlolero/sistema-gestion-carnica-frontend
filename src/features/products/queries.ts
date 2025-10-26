import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getUnits,
  getCategories,
  getProductCuts,
} from '@/api/modules/products.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateProductDto, UpdateProductDto } from './types'
import type { PaginationParams } from '@/types'

const PRODUCTS_KEY = 'products'
const UNITS_KEY = 'units'
const CATEGORIES_KEY = 'categories'
const CUTS_KEY = 'cuts'

export const useProducts = (params: PaginationParams = { page: 1, limit: 10 }) =>
  useQuery({
    queryKey: [PRODUCTS_KEY, params.page, params.limit],
    queryFn: () => getProducts(params),
  })

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateProductDto) => createProduct(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateProductDto }) => updateProduct(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] })
    },
  })
}

export const useUnits = () =>
  useQuery({
    queryKey: [UNITS_KEY],
    queryFn: getUnits,
    staleTime: 1000 * 60 * 60,
  })

export const useCategories = () =>
  useQuery({
    queryKey: [CATEGORIES_KEY],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60,
  })

export const useCuts = () =>
  useQuery({
    queryKey: [CUTS_KEY],
    queryFn: getProductCuts,
    staleTime: 1000 * 60 * 60,
  })
