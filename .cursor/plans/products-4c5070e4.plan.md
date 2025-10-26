<!-- 4c5070e4-9cd4-42f3-aac0-3b2693969cf3 f2972b9c-68d6-4067-a0b3-658b5faf1973 -->
# Products CRUD (antd + Tailwind, DTO-aligned)

## Scope

- Add full CRUD for `products` using modals on `ProductsListPage`.
- Mirror backend DTOs with zod on the frontend; you can reuse or modify `features/products/types.ts` schemas.
- Provide real selects for `baseUnitId` and `categories` using existing backend endpoints.

## Frontend (React + Antd + Tailwind)

- API modules:
- Update `src/api/modules/products.api.ts`:
- add: `getProduct(id)`, `createProduct(dto)`, `updateProduct(id,dto)`, `deleteProduct(id), getUnits, getCategories`
- add: `getProductCuts()` for select (proxy to `/products/cuts`)
- Queries (React Query): update `src/features/products/queries.ts`:
- keep `useProducts`
- add `useCreateProduct`, `useUpdateProduct`, `useDeleteProduct`
- add `useUnits`, `useCategories`, `useCuts`
- UI Components (keep files under 150 lines each):
- Add `src/features/products/components/ProductForm.tsx`
- React Hook Form + `zodResolver(productSchema)`
- Antd `Input`, `InputNumber`, `Switch`, `Select` with Tailwind classes
- Fields: name, description, barcode, baseUnitId (Select), isActive (Switch), pricePerKg, pricePerUnit, categories (multi Select)
- Cuts editor: list of rows `{cutId, pricePerKg?, pricePerUnit?}` with add/remove; validate at least one price per row (already in schema)
- Props: `defaultValues`, `onSubmit`, `isSubmitting`, `options` {units, categories, cuts}
- Add `src/features/products/components/ProductFormModal.tsx`
- Wraps `ProductForm` inside Antd `Modal`; props: `open`, `mode` ('create' | 'edit'), `initialProduct?`, `onClose`, `onSubmit`
- Page: update `src/features/products/pages/ProductsListPage.tsx`
- Display table (Antd `Table`) of products with columns: name, baseUnit, isActive, createdAt (optional)
- Actions: Edit (opens modal), Delete (Antd `Popconfirm`)
- Button "Add Product" opens create modal
- Invalidate `products` query after mutations
- Utilities
- Add `src/utils/dateFormat.ts` to format dates (wrapper over `dayjs`), used in table if `createdAt` is shown.
- Install libraries as needed.

## Validation & DTO alignment

- Use `productSchema` and nested schemas from `features/products/types.ts` to drive all form validation.
- Ensure payload shapes match backend `CreateProductDto`/`UpdateProductDto`:
- `Create`: omit `id`; `categories?: {categoryId:number}[]`, `cuts?: {cutId:number, pricePerKg?: number | null, pricePerUnit?: number | null}[]`
- `Update`: partial fields only; send only modified values
- Respect rule: at least one price globally and per cut

## Styling rules

- Use Tailwind classes only (no inline style, no CSS modules). Follow v4 utilities (e.g., `bg-black/50`, `items-center`, `justify-between`).
- Keep components small and DRY by extracting `ProductForm` and `ProductFormModal`.

## Testing

- NO TESTING FOR NOW

## Query Keys & Invalidation

- Products: `['products']`
- Units: `['units']`
- Categories: `['categories']`
- Cuts: `['cuts']`
- After create/update/delete: invalidate `['products']`.

### To-dos

- [ ] Install necesary libraries
- [ ] Extend products.api with CRUD and necesary endpoints
- [ ] Add react-query hooks for products CRUD and option lists
- [ ] Implement ProductForm with RHF + zod + antd controls
- [ ] Implement ProductFormModal wrapper for create/edit
- [ ] Update ProductsListPage to table + actions + modals
- [ ] Add utils/dateFormat.ts and use for createdAt column
- [ ] Run pnpm prettier --write on modified files
- [ ] Check for any problems in all modified files and fix them.