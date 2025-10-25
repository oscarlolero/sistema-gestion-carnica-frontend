import { Outlet } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import { queryClient } from './api/queryClient'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { themeConfig } from './theme/theme'

function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Outlet />
      </QueryClientProvider>
    </ConfigProvider>
  )
}

export default App
