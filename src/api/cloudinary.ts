import { client } from './client'

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration missing')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', import.meta.env.VITE_CLOUDINARY_FOLDER || '')

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Error al subir la imagen')
  }

  const data = await response.json()
  return data.secure_url
}

export const deleteCloudinaryImage = async (
  imageUrl: string,
): Promise<{ success: boolean; result?: unknown; message?: string }> => {
  const res = await client.delete('/cloudinary/image', {
    data: { imageUrl },
  })
  return res.data
}
