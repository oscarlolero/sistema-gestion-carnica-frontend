import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getProductCuts,
} from '@/api/modules/products.api'
import { uploadImageToCloudinary } from '@/api/cloudinary'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateProductDto, UpdateProductDto } from './types'
import type { PaginationWithSortParams } from '@/types'

const PRODUCTS_KEY = 'products'
const CATEGORIES_KEY = 'categories'
const CUTS_KEY = 'cuts'

export const useProducts = (
  params: PaginationWithSortParams & { search?: string; includeInactive?: boolean } = {
    page: 1,
    limit: 10,
  },
) =>
  useQuery({
    queryKey: [
      PRODUCTS_KEY,
      params.page,
      params.limit,
      params.search,
      params.sortBy,
      params.order,
      params.includeInactive,
    ],
    queryFn: () => getProducts(params),
  })

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreateProductDto) => {
      // Si imageUrl es un File, subirlo primero a Cloudinary
      if (dto.imageUrl instanceof File) {
        const uploadedUrl = await uploadImageToCloudinary(dto.imageUrl)
        return createProduct({ ...dto, imageUrl: uploadedUrl })
      }
      return createProduct(dto)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dto }: { id: number; dto: UpdateProductDto }) => {
      // Si imageUrl es un File, subirlo primero a Cloudinary
      if (dto.imageUrl instanceof File) {
        const uploadedUrl = await uploadImageToCloudinary(dto.imageUrl)
        return updateProduct(id, { ...dto, imageUrl: uploadedUrl })
      }
      return updateProduct(id, dto)
    },
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
