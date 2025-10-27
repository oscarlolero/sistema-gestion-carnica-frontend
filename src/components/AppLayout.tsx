import { useEffect, useMemo, useState } from 'react'
import { Layout, Menu, Button, Grid, Typography, theme as antdTheme } from 'antd'
import type { MenuProps } from 'antd'
import {
  AppstoreOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { Link, Outlet, useLocation } from 'react-router-dom'

const { Sider, Header, Content } = Layout
const { useToken } = antdTheme

const getBasePath = (pathname: string) => {
  if (pathname === '/') return '/products'
  const [, firstSegment] = pathname.split('/')
  return `/${firstSegment}`
}

export const AppLayout = () => {
  const location = useLocation()
  const { token } = useToken()
  const screens = Grid.useBreakpoint()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    setCollapsed(!screens.lg)
  }, [screens.lg])

  const navItems = useMemo(
    () => [
      {
        key: '/products',
        label: 'Productos',
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

  const menuItems: MenuProps['items'] = useMemo(
    () =>
      navItems.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: <Link to={item.key}>{item.label}</Link>,
      })),
    [navItems],
  )

  const selectedKey = getBasePath(location.pathname)
  const collapsedWidth = screens.lg ? 72 : 0

  return (
    <Layout style={{ height: '100vh', background: token.colorBgLayout }}>
      <Sider
        collapsible
        collapsed={collapsed}
        collapsedWidth={collapsedWidth}
        onCollapse={setCollapsed}
        width={248}
        breakpoint="lg"
        style={{
          background: 'linear-gradient(180deg, #B22222 0%, #661414 100%)',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
        trigger={null}
      >
        <div
          style={{
            padding: collapsed ? '24px 12px' : '28px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? 8 : 12,
            color: '#fff',
            fontWeight: 600,
            fontSize: collapsed ? 16 : 20,
            lineHeight: 1,
            letterSpacing: 0.3,
          }}
        >
          {!collapsed && <div className="text-white text-xl font-bold">Sistema Carnes</div>}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{
            background: 'transparent',
            padding: '8px 12px',
          }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: token.colorBgContainer,
            borderBottom: `1px solid ${token.colorBorder}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((prev) => !prev)}
            style={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
          <Typography.Title
            level={4}
            style={{ margin: 0, color: token.colorText, fontWeight: 600 }}
          >
            {navItems.find((item) => item.key === selectedKey)?.label ?? 'ERROR'}
          </Typography.Title>
        </Header>

        <Content
          className="flex flex-col h-[calc(100vh-64px)] m-0 p-0"
          style={{ background: token.colorBgLayout }}
        >
          <div
            className={`bg-white rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.05)] flex-1 overflow-auto min-h-0 ${
              screens.xs ? 'm-4 p-4' : 'm-6 p-6'
            }`}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout
