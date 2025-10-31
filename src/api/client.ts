import axios, { AxiosError, isAxiosError } from 'axios'
import { message as antdMessage } from 'antd'

declare module 'axios' {
  export interface AxiosRequestConfig {
    suppressErrorToast?: boolean
  }
}

type ApiErrorResponse = {
  message?: string
  error?: string
  errors?: string[] | Record<string, string[] | string>
  [key: string]: unknown
}

const pickApiMessage = (err: AxiosError<ApiErrorResponse>): string => {
  const data = err.response?.data
  const rawErrors = data?.errors

  const msg =
    [
      data?.message,
      data?.error,
      ...(Array.isArray(rawErrors)
        ? rawErrors
        : rawErrors
          ? Object.values(rawErrors).flatMap((v) => (Array.isArray(v) ? v : [v]))
          : []),
      err.response?.statusText,
      err.message,
    ].find((v): v is string => typeof v === 'string' && v.trim().length > 0) ??
    'Ocurrió un error inesperado. Intenta nuevamente.'

  return msg
}

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const suppressErrorToast = (err.config as { suppressErrorToast?: boolean } | undefined)
      ?.suppressErrorToast

    // Ignore cancellations (e.g. aborted requests)
    if (
      !suppressErrorToast &&
      isAxiosError<ApiErrorResponse>(err) &&
      err.code !== AxiosError.ERR_CANCELED
    ) {
      antdMessage.open({ type: 'error', content: pickApiMessage(err), duration: 4 })
    }
    return Promise.reject(err)
  },
)
