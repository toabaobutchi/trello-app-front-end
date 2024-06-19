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

export interface ToastOptionsType {
  delay?: number
  floatDuration?: number
  fadeOutDuration?: number
  removeAfterDelay?: number
}

export interface ToastType {
  icon?: React.ReactNode
  closeIcon?: React.ReactNode
  title?: React.ReactNode
  content?: React.ReactNode
  type?: 'success' | 'error' | 'warning' | 'info'
  options?: ToastOptionsType
}

export type Workspace = {
  id: number,
  name: string,
  createAt: number,
  slug: string,
  description: string
  projects?: Project[],
}

export type Project = {
  id: string,
  description?: string,
  name: string,
  createdAt: number,
  slug: string,
  workspaceId: number
  color?: string
  dueDate?: number
}

export type LoginInfo = {
  accessToken: string
  accountInfo: AccountType
}