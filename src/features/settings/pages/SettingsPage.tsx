import { Switch, Card, Typography, message } from 'antd'
import { useSetting, useUpdateSetting } from '@/features/settings/queries'

const { Title, Text } = Typography

export const SettingsPage = () => {
  const { data: showPricesSetting } = useSetting('SHOW_PRICES_IN_POS')
  const updateSettingMutation = useUpdateSetting()

  const handleTogglePrices = (checked: boolean) => {
    updateSettingMutation.mutate(
      {
        key: 'SHOW_PRICES_IN_POS',
        value: String(checked),
        description: 'Mostrar precios en el POS y tickets',
      },
      {
        onSuccess: () => {
          message.success('Configuración actualizada')
        },
        onError: () => {
          message.error('Error al actualizar configuración')
        },
      },
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Title level={3} className="mb-1 text-[#2d2d2d]">
          Configuración
        </Title>
        <Text className="text-gray-500">Administra las configuraciones globales del sistema</Text>
      </div>

      <Card title="Punto de Venta (POS)" className="shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between py-2">
          <div className="space-y-1">
            <div className="font-medium text-[#2d2d2d]">Mostrar precios</div>
            <div className="text-sm text-gray-500">
              Muestra los precios unitarios, subtotales, totales y métodos de pago en el POS y
              tickets impresos
            </div>
          </div>
          <Switch
            checked={showPricesSetting?.value !== 'false'}
            onChange={handleTogglePrices}
            loading={updateSettingMutation.isPending}
            className="bg-gray-300 [&.ant-switch-checked]:bg-[#b22222]"
          />
        </div>
      </Card>
    </div>
  )
}
