import { Modal, Form, Input, Button } from 'antd'
import { useCreateUser } from '@/features/users/queries'
import { message } from 'antd'

type AddUserModalProps = {
  open: boolean
  onClose: () => void
  onUserCreated: (userId: number) => void
}

export const AddUserModal = ({ open, onClose, onUserCreated }: AddUserModalProps) => {
  const [form] = Form.useForm()
  const createUserMutation = useCreateUser()

  const handleCreateUser = async (values: { name: string }) => {
    try {
      const newUser = await createUserMutation.mutateAsync(values)
      message.success('Empleado agregado exitosamente')
      form.resetFields()
      onUserCreated(newUser.id)
      onClose()
    } catch (error) {
      message.error('Error al agregar empleado')
      console.error('Error creating user:', error)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title="Agregar Empleado"
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
    >
      <Form form={form} onFinish={handleCreateUser} layout="vertical">
        <Form.Item
          name="name"
          label="Nombre del empleado"
          rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
        >
          <Input placeholder="Ej. Juan Perez" />
        </Form.Item>
        <div className="flex justify-end gap-2">
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={createUserMutation.isPending}
            className="bg-[#b22222] hover:bg-[#921c1c]"
          >
            Guardar
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
