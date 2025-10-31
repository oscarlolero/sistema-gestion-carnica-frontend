import { useState } from 'react'
import { Button, Image, message, Upload } from 'antd'
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import { deleteCloudinaryImage } from '@/api/cloudinary'
import type { UploadProps } from 'antd'

type CloudinaryUploadWidgetProps = {
  value?: string | File | null
  onChange?: (value: string | File | null) => void
  disabled?: boolean
}

export const CloudinaryUploadWidget = ({
  value,
  onChange,
  disabled = false,
}: CloudinaryUploadWidgetProps) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Determinar la URL de preview
  const displayUrl = value instanceof File ? previewUrl : typeof value === 'string' ? value : null

  const handleBeforeUpload: UploadProps['beforeUpload'] = (file) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('Solo puedes subir archivos de imagen')
      return Upload.LIST_IGNORE
    }

    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isLt10M) {
      message.error('La imagen debe ser menor a 10MB')
      return Upload.LIST_IGNORE
    }

    // Crear preview local
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Guardar el archivo en el estado del formulario
    onChange?.(file)

    // Prevenir la subida automática
    return false
  }

  const handleRemoveImage = async () => {
    if (!value) return

    // Si es un archivo local, solo limpiar el estado
    if (value instanceof File) {
      onChange?.(null)
      setPreviewUrl(null)
      return
    }

    // Si es una URL de Cloudinary, eliminar del servidor
    if (typeof value === 'string') {
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
  }

  return (
    <div className="flex flex-col gap-3">
      {displayUrl && (
        <div className="relative inline-block">
          <Image
            src={displayUrl}
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

      {!displayUrl && (
        <Upload
          beforeUpload={handleBeforeUpload}
          showUploadList={false}
          accept="image/*"
          disabled={disabled}
        >
          <Button
            icon={<UploadOutlined />}
            disabled={disabled}
            size="large"
            className="w-full sm:w-auto"
          >
            Seleccionar Imagen
          </Button>
        </Upload>
      )}
    </div>
  )
}
