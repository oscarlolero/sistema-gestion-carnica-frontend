import { useEffect, useState } from 'react'
import { Spin, Typography } from 'antd'
import { client } from '../api/client'

const { Title, Text } = Typography

const WARMUP_KEY = 'backendWarmedAt'
const WARMUP_VALIDITY_MS = 10 * 60 * 1000 // 10 minutes

const getLastWarmupTime = (): number | null => {
  const stored = localStorage.getItem(WARMUP_KEY)
  return stored ? parseInt(stored, 10) : null
}

const setWarmupTime = () => {
  localStorage.setItem(WARMUP_KEY, Date.now().toString())
}

const isRecentlyWarmed = (): boolean => {
  const lastWarmup = getLastWarmupTime()
  if (!lastWarmup) return false
  return Date.now() - lastWarmup < WARMUP_VALIDITY_MS
}

export const ServerWarmup = ({ children }: { children: React.ReactNode }) => {
  const [isServerReady, setIsServerReady] = useState(isRecentlyWarmed())
  const [isChecking, setIsChecking] = useState(!isRecentlyWarmed())
  const [dots, setDots] = useState('')

  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        await client.get('/health', { timeout: 60000, suppressErrorToast: true })
        setIsServerReady(true)
        setIsChecking(false)
        setWarmupTime() // Save successful timestamp
      } catch {
        // If we were in optimistic mode and it fails, go back to booting
        if (isRecentlyWarmed()) {
          setIsServerReady(false)
          setIsChecking(true)
        }
        // Retry after 2 seconds
        setTimeout(checkServerHealth, 2000)
      }
    }

    checkServerHealth()
  }, [])

  // Dots animation
  useEffect(() => {
    if (!isChecking) return

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'))
    }, 500)

    return () => clearInterval(interval)
  }, [isChecking])

  if (isChecking || !isServerReady) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 gap-6">
        <Spin size="large" />
        <div className="text-center">
          <Title level={3} className="m-0 mb-2">
            Encendiendo servidor{dots}
          </Title>
          <Text type="secondary">El servidor está iniciando, esto puede tomar hasta 1 minuto.</Text>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
