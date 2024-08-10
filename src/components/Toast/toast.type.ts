export type ToastOptions = {
  type?: ToastType
  position?: ToastPosition
  duration?: Milisecond
  floatIn?: Milisecond
  fadeOut?: Milisecond
  removeFromDOM?: Milisecond
  autoClose?: boolean
  toastElement?: ToastElement
  variant?: ToastVariant
  showTimeLine?: boolean
  icon?: React.ReactNode
}

export type TypedToastOptions = Omit<ToastOptions, 'type'>

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'

export type ToastType = 'success' | 'error' | 'warning' | 'waiting' | 'info'

export type ToastVariant = 'filled' | 'white'

export type Milisecond = number

export type ToastElement = {
  tagName: keyof HTMLElementTagNameMap
  className: string
  style: React.CSSProperties
}
