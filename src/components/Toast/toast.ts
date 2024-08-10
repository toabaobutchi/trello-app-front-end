import toastConfigs from './toast.config'
import { ToastOptions, ToastType, TypedToastOptions } from './toast.type'
import React from 'react'
import {
  getClassName,
  getHtml,
  registerCloseButtonClick,
  removeToastAfterTimeOut,
  setStyle,
  setTimeLineCSSVariable
} from './toast.util'

const toastContainerId = toastConfigs.containerId || 'toast-container'
const MISSING_CONTAINER_ERROR_MSG =
  'Can not find container for toast. Please use component `<ToastContainer />` or manually add an element with `id="toast-container"`'

const toast = (title: React.ReactNode, content: React.ReactNode, options?: ToastOptions) => {
  const container = document.getElementById(toastContainerId)

  if (!container) {
    console.error(MISSING_CONTAINER_ERROR_MSG)
    return
  }

  const toast = document.createElement(options?.toastElement?.tagName || 'div')
  toast.className = getClassName(options)

  setStyle(toast, options)

  setTimeLineCSSVariable(toast, options)

  toast.innerHTML = getHtml(title, content, options)
  container.appendChild(toast)

  const timeOutId = removeToastAfterTimeOut(toast, options)
  registerCloseButtonClick(toast, timeOutId)
}

toast.success = (title: React.ReactNode, content: React.ReactNode, options?: TypedToastOptions) => {
  toast(title, content, { ...options, type: 'success' })
}

toast.error = (title: React.ReactNode, content: React.ReactNode, options?: TypedToastOptions) => {
  toast(title, content, { ...options, type: 'error' })
}

toast.info = (title: React.ReactNode, content: React.ReactNode, options?: TypedToastOptions) => {
  toast(title, content, { ...options, type: 'info' })
}
toast.warning = (title: React.ReactNode, content: React.ReactNode, options?: TypedToastOptions) => {
  toast(title, content, { ...options, type: 'warning' })
}
toast.promise = async <TPromise>(
  title: React.ReactNode,
  content: React.ReactNode,
  promise: Promise<TPromise>,
  getMessageAfterWaiting: (result: TPromise) => { type: ToastType; title?: React.ReactNode; message: React.ReactNode },
  options?: TypedToastOptions
) => {
  const container = document.getElementById(toastContainerId)

  const typedOptions = { ...options, type: 'waiting' } as ToastOptions

  if (!container) {
    console.error(MISSING_CONTAINER_ERROR_MSG)
    return
  }
  const result = promise
  const toast = document.createElement(options?.toastElement?.tagName || 'div')
  toast.className = getClassName(typedOptions)

  setTimeLineCSSVariable(toast, typedOptions)

  toast.innerHTML = getHtml(title, content, typedOptions)
  container.appendChild(toast)

  const res = await result
  const toastResult = getMessageAfterWaiting(res)
  container.removeChild(toast)
  setStyle(toast, options)

  toast.innerHTML = getHtml(toastResult.title, toastResult.message, { ...typedOptions, type: toastResult.type })
  toast.className = getClassName({ ...typedOptions, type: toastResult.type })

  container.appendChild(toast)

  const timeOutId = removeToastAfterTimeOut(toast, typedOptions)
  registerCloseButtonClick(toast, timeOutId)

  return res
}

export default toast
