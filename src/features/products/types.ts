import { z } from 'zod'

/**
 * 🧱 0. Tipos auxiliares para relaciones y precios por corte
 */
const nonNegativeNumber = z.number().nonnegative()

export const productCategorySchema = z.object({
  categoryId: z.number().int().positive('La categoría debe ser un ID positivo'),
})

export type ProductCategoryInput = z.infer<typeof productCategorySchema>

export const productCutSchema = z
  .object({
    cutId: z.number().int().positive('El corte debe ser un ID positivo'),
    pricePerKg: nonNegativeNumber.nullish(),
    pricePerUnit: nonNegativeNumber.nullish(),
  })
  .refine(
    ({ pricePerKg, pricePerUnit }) =>
      pricePerKg !== null && pricePerKg !== undefined
        ? true
        : pricePerUnit !== null && pricePerUnit !== undefined,
    {
      message: 'Cada corte requiere al menos un precio (kg o unidad)',
      path: ['pricePerKg', 'pricePerUnit'],
    },
  )

export type ProductCutInput = z.infer<typeof productCutSchema>

/**
 * 🧾 1. Definimos el schema de validación
 *    — usado por React Hook Form, formularios y validaciones locales.
 */
export const productSchema = z
  .object({
    id: z.number().int().positive().optional(),
    name: z
      .string()
      .min(1, 'El nombre es requerido')
      .max(255, 'El nombre no debe exceder 255 caracteres'),
    description: z.string().max(500, 'Máximo 500 caracteres').nullish(),
    barcode: z
      .string()
      .min(1, 'El código de barras no puede estar vacío')
      .max(128, 'El código de barras no debe exceder 128 caracteres')
      .nullish(),
    pricePerKg: nonNegativeNumber.nullish(),
    pricePerUnit: nonNegativeNumber.nullish(),
    isActive: z.boolean().default(true),
    baseUnitId: z
      .number()
      .int('La unidad base debe ser un número entero')
      .positive('La unidad base debe ser un ID positivo'),
    categories: z.array(productCategorySchema).optional(),
    cuts: z.array(productCutSchema).optional(),
  })
  .refine(
    ({ pricePerKg, pricePerUnit }) =>
      pricePerKg !== null && pricePerKg !== undefined
        ? true
        : pricePerUnit !== null && pricePerUnit !== undefined,
    {
      message: 'Debes ingresar al menos un precio (por kg o por unidad)',
      path: ['pricePerKg', 'pricePerUnit'],
    },
  )

/**
 * ✅ 2. Derivamos el tipo TypeScript a partir del schema
 *    — esto asegura que el tipo y la validación estén siempre sincronizados.
 */
export type Product = z.infer<typeof productSchema>

/**
 * 🧱 3. Definimos tipos auxiliares
 *    — para adaptarnos al backend o a las operaciones de React Query.
 */

// Datos que se envían al backend (sin ID)
export type CreateProductDto = Omit<Product, 'id'>

// Update DTO should only include modified fields
export type UpdateProductDto = Partial<CreateProductDto>

// Datos que vienen del backend (ya con IDs o timestamps)
export interface ProductResponse extends Product {
  id: number
  createdAt: string
  updatedAt: string
}

// Resultado de una lista de productos
export type ProductListResponse = ProductResponse[]
