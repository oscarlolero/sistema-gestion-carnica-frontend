export type PosCategory = {
  id: string
  label: string
}

export type PosProduct = {
  id: string
  name: string
  unit: string
  price: number
  imageUrl: string
  categoryId: string
  badge?: string
}

export type PosTicketItem = {
  id: string
  name: string
  quantity: number
  unit: string
  price: number
}

export const posCategories: PosCategory[] = [
  { id: 'all', label: 'Todas' },
  { id: 'red-meat', label: 'Carnes rojas' },
  { id: 'poultry', label: 'Aves' },
  { id: 'sausages', label: 'Embutidos' },
]

export const posProducts: PosProduct[] = [
  {
    id: 'p1',
    name: 'Bife de Chorizo',
    unit: 'Por kg',
    price: 12.5,
    imageUrl:
      'https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=800&q=80',
    categoryId: 'red-meat',
  },
  {
    id: 'p2',
    name: 'Asado de Tira',
    unit: 'Por kg',
    price: 9.8,
    imageUrl:
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
    categoryId: 'red-meat',
    badge: 'Venta corta',
  },
  {
    id: 'p3',
    name: 'Vacío',
    unit: 'Por kg',
    price: 11.2,
    imageUrl:
      'https://images.unsplash.com/photo-1604908815110-876e66f02339?auto=format&fit=crop&w=800&q=80',
    categoryId: 'red-meat',
  },
  {
    id: 'p4',
    name: 'Costillas',
    unit: 'Por kg',
    price: 8.5,
    imageUrl:
      'https://images.unsplash.com/photo-1608032362137-662b8166b10d?auto=format&fit=crop&w=800&q=80',
    categoryId: 'red-meat',
    badge: 'Venta corta',
  },
  {
    id: 'p5',
    name: 'Brochetas Mixtas',
    unit: 'Por bandeja',
    price: 13.2,
    imageUrl:
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
    categoryId: 'poultry',
  },
  {
    id: 'p6',
    name: 'Tabla Parrillera',
    unit: 'Por unidad',
    price: 22.6,
    imageUrl:
      'https://images.unsplash.com/photo-1608032363093-08746a69836b?auto=format&fit=crop&w=800&q=80',
    categoryId: 'sausages',
  },
]

export const posTicketItems: PosTicketItem[] = [
  { id: 't1', name: 'Bife de Chorizo', quantity: 1.2, unit: 'kg', price: 15.0 },
  { id: 't2', name: 'Asado de Tira', quantity: 0.8, unit: 'kg', price: 7.84 },
]
