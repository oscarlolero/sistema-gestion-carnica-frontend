import { useMemo } from 'react'
import { AppstoreOutlined, FileTextOutlined } from '@ant-design/icons'

export const useNavigation = () => {
  const navItems = useMemo(
    () => [
      {
        key: '/products',
        label: 'Productos',
        icon: <AppstoreOutlined />,
      },
      {
        key: '/pos',
        label: 'POS',
        icon: <AppstoreOutlined />,
      },
      {
        key: '/tickets',
        label: 'Tickets',
        icon: <FileTextOutlined />,
      },
    ],
    [],
  )

  return { navItems }
}

export const getBasePath = (pathname: string) => {
  if (pathname === '/') return '/products'
  const [, firstSegment] = pathname.split('/')
  return `/${firstSegment}`
}
