import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

type PosSearchBarProps = {
  value: string
  onChange: (value: string) => void
}

export const PosSearchBar = ({ value, onChange }: PosSearchBarProps) => {
  return (
    <Input
      placeholder="Buscar productos..."
      value={value}
      onChange={(event) => onChange(event.target.value)}
      prefix={<SearchOutlined className="text-[#b8a898]" />}
      className="rounded-xl border-transparent bg-[#f7f0e6] text-[#4a4a4a] shadow-inner placeholder:text-[#b8a898] hover:border-[#d7c1ac] focus:border-[#d7c1ac] [&_.ant-input]:bg-transparent [&_.ant-input]:text-sm"
    />
  )
}
