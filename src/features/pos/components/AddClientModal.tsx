import { Modal, Form, Input, Button } from 'antd'
import { useCreateClient } from '@/features/clients/queries'
import { message } from 'antd'

type AddClientModalProps = {
  open: boolean
  onClose: () => void
  onClientCreated: (clientId: number) => void
}

export const AddClientModal = ({ open, onClose, onClientCreated }: AddClientModalProps) => {
  const [form] = Form.useForm()
  const createClientMutation = useCreateClient()

  const handleCreateClient = async (values: { name: string }) => {
    try {
      const newClient = await createClientMutation.mutateAsync(values)
      message.success('Cliente agregado exitosamente')
      form.resetFields()
      onClientCreated(newClient.id)
      onClose()
    } catch (error) {
      message.error('Error al agregar cliente')
      console.error('Error creating client:', error)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title="Agregar Cliente"
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
    >
      <Form form={form} onFinish={handleCreateClient} layout="vertical">
        <Form.Item
          name="name"
          label="Nombre del cliente"
          rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
        >
          <Input placeholder="Ej. Cliente XYZ" />
        </Form.Item>
        <div className="flex justify-end gap-2">
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={createClientMutation.isPending}
            className="bg-[#b22222] hover:bg-[#921c1c]"
          >
            Guardar
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
