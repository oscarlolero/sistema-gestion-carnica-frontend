import dayjs from 'dayjs'

export const dateFormat = (iso?: string | null, fmt = 'DD/MM/YYYY hh:mm A') => {
  if (!iso) return ''
  return dayjs(iso).format(fmt)
}
