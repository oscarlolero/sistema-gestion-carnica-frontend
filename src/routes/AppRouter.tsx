import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProductsListPage } from '../features/products'
import { TicketsListPage } from '../features/tickets'
import { PosPage } from '../features/pos'
import App from '../App'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Navigate to="/pos" replace /> },
      { path: 'products', element: <ProductsListPage /> },
      { path: 'tickets', element: <TicketsListPage /> },
      { path: 'pos', element: <PosPage /> },
    ],
  },
])
