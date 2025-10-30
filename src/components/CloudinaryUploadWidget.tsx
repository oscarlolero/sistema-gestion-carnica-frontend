import { useEffect, useRef, useState } from 'react'
import { Button, Image, message } from 'antd'
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import { deleteCloudinaryImage } from '@/api/cloudinary'

interface CloudinaryUploadWidget {
  open: () => void
  close: () => void
}

interface CloudinaryUploadResult {
  event: string
  info: {
    secure_url: string
  }
}

interface CloudinaryError {
  message: string
}

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: unknown,
        callback: (error: CloudinaryError | null, result: CloudinaryUploadResult) => void,
      ) => CloudinaryUploadWidget
    }
  }
}

type CloudinaryUploadWidgetProps = {
  value?: string | null
  onChange?: (url: string | null) => void
  disabled?: boolean
}

export const CloudinaryUploadWidget = ({
  value,
  onChange,
  disabled = false,
}: CloudinaryUploadWidgetProps) => {
  const widgetRef = useRef<CloudinaryUploadWidget | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    // Check if script is already loaded
    if (window.cloudinary) {
      setScriptLoaded(true)
      return
    }

    // Load Cloudinary widget script
    if (!document.getElementById('cloudinary-upload-widget')) {
      const script = document.createElement('script')
      script.id = 'cloudinary-upload-widget'
      script.src = 'https://upload-widget.cloudinary.com/global/all.js'
      script.async = true
      script.onload = () => {
        setScriptLoaded(true)
      }
      document.body.appendChild(script)
    }
  }, [])

  useEffect(() => {
    // Initialize widget only after script is loaded
    if (!scriptLoaded || widgetRef.current) return

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      console.error(
        'Cloudinary configuration missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET',
      )
      return
    }

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ['local'],
        multiple: false,
        maxFiles: 1,
        clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp', 'gif'],
        maxFileSize: 10000000,
        folder: import.meta.env.VITE_CLOUDINARY_FOLDER,
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          const imageUrl = result.info.secure_url
          onChange?.(imageUrl)
          setIsLoading(false)
        } else if (error) {
          console.error('Upload error:', error)
          setIsLoading(false)
        }
      },
    )
  }, [scriptLoaded, onChange])

  const handleOpenWidget = () => {
    if (widgetRef.current) {
      setIsLoading(true)
      widgetRef.current.open()
    }
  }

  const handleRemoveImage = async () => {
    if (!value) return

    setIsDeleting(true)
    try {
      const result = await deleteCloudinaryImage(value)

      if (result.success) {
        message.success('Imagen eliminada correctamente')
        onChange?.(null)
      } else {
        message.error(result.message || 'Error al eliminar la imagen')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      message.error('Error al eliminar la imagen')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {value && (
        <div className="relative inline-block">
          <Image
            src={value}
            alt="Product preview"
            className="rounded-lg border border-gray-200"
            style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
            preview={{
              mask: 'Ver imagen',
            }}
          />
          {!disabled && (
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
              loading={isDeleting}
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          )}
        </div>
      )}

      {!value && (
        <Button
          icon={<UploadOutlined />}
          onClick={handleOpenWidget}
          disabled={disabled || isLoading}
          loading={isLoading}
          size="large"
          className="w-full sm:w-auto"
        >
          {isLoading ? 'Subiendo...' : 'Subir Imagen'}
        </Button>
      )}
    </div>
  )
}
