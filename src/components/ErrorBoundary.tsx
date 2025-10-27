import React, { Component, ReactNode } from 'react'
import { Result, Button } from 'antd'
import { FallOutlined } from '@ant-design/icons'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Result
          icon={<FallOutlined className="text-red-500" />}
          status="error"
          title="Algo salió mal"
          subTitle={this.state.error?.message || 'Ocurrió un error inesperado en la aplicación'}
          extra={
            <Button type="primary" onClick={() => window.location.reload()}>
              Recargar página
            </Button>
          }
        />
      )
    }

    return this.props.children
  }
}
