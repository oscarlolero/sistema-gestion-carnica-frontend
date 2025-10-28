import { client } from './client'

export const deleteCloudinaryImage = async (
  imageUrl: string,
): Promise<{ success: boolean; result?: unknown; message?: string }> => {
  const res = await client.delete('/cloudinary/image', {
    data: { imageUrl },
  })
  return res.data
}
