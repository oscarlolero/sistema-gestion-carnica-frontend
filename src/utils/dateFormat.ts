import dayjs from 'dayjs'

export const dateFormat = (iso?: string | null, fmt = 'YYYY-MM-DD HH:mm') => {
  if (!iso) return ''
  return dayjs(iso).format(fmt)
}
