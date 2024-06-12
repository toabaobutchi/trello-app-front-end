export interface CustomizablePropType {
  content?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  customHtmlAttributes?: object
}

export type ThemeType = 'success' | 'warning' | 'danger' | 'primary' | 'info' | 'light' | 'secondary' | 'dark'