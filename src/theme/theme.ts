import type { ThemeConfig } from 'antd'

export const themeConfig: ThemeConfig = {
  token: {
    // 🎨 Colores base
    colorPrimary: '#B22222',
    colorPrimaryHover: '#8F1C1C',
    colorPrimaryActive: '#661414',
    colorBgBase: '#F8F3ED',
    colorTextBase: '#2C2C2C',
    colorBorder: '#E8E8E8',

    // 🎯 Estados
    colorSuccess: '#4CAF50',
    colorWarning: '#E3B341',
    colorError: '#F44336',
    colorInfo: '#7D9A6D',

    // 💡 Fondos y texto secundarios
    colorBgContainer: '#FFFFFF',
    colorBgLayout: '#F8F3ED',
    colorTextSecondary: '#555555',

    // 🔠 Tipografía
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    fontSize: 14,
    lineHeight: 1.6,

    // 🧱 Bordes y radios
    borderRadius: 12,
    controlHeight: 42,
    controlOutlineWidth: 0,
  },
  components: {
    Button: {
      borderRadius: 10,
      controlHeight: 44,
      fontWeight: 600,
    },
    Input: {
      borderRadius: 8,
      colorBgContainer: '#FFFFFF',
    },
    Table: {
      headerBg: '#F8F3ED',
      headerColor: '#2C2C2C',
      borderColor: '#E8E8E8',
    },
    Tabs: {
      itemSelectedColor: '#B22222',
      inkBarColor: '#B22222',
    },
    Modal: {
      headerBg: '#F8F3ED',
      colorTextHeading: '#2C2C2C',
    },
  },
}
