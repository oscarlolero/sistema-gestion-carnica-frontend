import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSetting, updateSetting } from '@/api/modules/settings.api'

export const useSetting = (key: string) => {
  return useQuery({
    queryKey: ['settings', key],
    queryFn: () => getSetting(key),
  })
}

export const useUpdateSetting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      key,
      value,
      description,
    }: {
      key: string
      value: string
      description?: string
    }) => updateSetting(key, value, description),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['settings', variables.key] })
    },
  })
}
