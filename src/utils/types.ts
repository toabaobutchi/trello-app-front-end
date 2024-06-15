export interface CustomizablePropType {
  content?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  customHtmlAttributes?: object
}

export type ThemeType = 'success' | 'warning' | 'danger' | 'primary' | 'info' | 'light' | 'secondary' | 'dark' | 'default'

export interface AccountType {
  id: string
  displayName: string
  avatar?: string
  email: string
  exp?: number
}