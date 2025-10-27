import { createBrowserRouter } from 'react-router-dom'
import { ProductsListPage } from '../features/products'
import { TicketsListPage } from '../features/tickets'
import App from '../App'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'products', element: <ProductsListPage /> },
      { path: 'tickets', element: <TicketsListPage /> },
    ],
  },
])
