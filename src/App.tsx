import { QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import { queryClient } from './api/queryClient'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { themeConfig } from './theme/theme'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AppLayout } from './components/AppLayout'

function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider theme={themeConfig}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <AppLayout />
        </QueryClientProvider>
      </ConfigProvider>
    </ErrorBoundary>
  )
}

export default App
