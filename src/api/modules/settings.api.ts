import { client } from '../client'

export type SystemSetting = {
  key: string
  value: string
  description?: string
}

export const getSetting = async (key: string): Promise<SystemSetting | null> => {
  const res = await client.get(`/settings/${key}`)
  return res.data
}

export const updateSetting = async (
  key: string,
  value: string,
  description?: string,
): Promise<SystemSetting> => {
  const res = await client.put(`/settings/${key}`, { value, description })
  return res.data
}
