import { Button } from 'antd'
import { useProducts } from '../queries'

export const ProductsListPage = () => {
  const { data: products, isLoading, error } = useProducts()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="flex flex-col gap-4">
      <h1>Products</h1>
      <Button type="primary" onClick={() => {}}>
        Add Product
      </Button>
      <ul>
        {products?.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  )
}
