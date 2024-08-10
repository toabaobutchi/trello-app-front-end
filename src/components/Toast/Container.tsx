import { memo } from 'react'
import toastConfigs from './toast.config'
import { ToastPosition } from './toast.type'
import './Toast.scss'

const containerId = toastConfigs.containerId || 'toast-container'

type ToastContainerProps = {
  position?: ToastPosition
  stackedContainer?: boolean
}

const ToastContainer = memo(({ position = 'top-right', stackedContainer = false }: ToastContainerProps) => {
  return (
    <div
      data-position={position}
      className={`toast-container__${position}${stackedContainer ? ' toast-container__stacked' : ''}`}
      id={containerId}
    ></div>
  )
})

export default ToastContainer
