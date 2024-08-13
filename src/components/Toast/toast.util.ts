import React from 'react'
import { ToastOptions, ToastPosition } from './toast.type'
import { renderToString } from 'react-dom/server'
import toastConfigs from './toast.config'

const toastContainerId = toastConfigs.containerId || 'toast-container'

function registerCloseButtonClick(toast: HTMLElement, timeOutId?: number) {
  if (toast) {
    toast.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.toast-close')) {
        if (timeOutId) clearTimeout(timeOutId)
        toast.style.animation = getAnimation({ floatIn: 0, duration: 0 })
        setTimeout(() => {
          document.getElementById(toastContainerId)?.removeChild(toast)
        }, 300)
      }
    })
  }
}

function setStyle(toast: HTMLElement, options?: ToastOptions) {
  Object.assign(toast.style, {
    ...options?.toastElement?.style,
    animation: getAnimation(options)
  })
}

function getAnimation(options?: ToastOptions) {
  const container = document.getElementById(toastContainerId)
  if (!container) return ''
  const containerAnimationDir = container.dataset.position
  const position = options?.position ?? containerAnimationDir
  const direction = getAnimationDirection(position as ToastPosition)
  return `floatInto${direction} ${
    options?.floatIn ?? 300
  }ms cubic-bezier(0.175, 0.885, 0.32, 1.275), fadeOut${direction} ${options?.fadeOut ?? 300}ms ${
    options?.duration ?? 3000
  }ms ease-in-out forwards`
}

function removeToastAfterTimeOut(toast?: HTMLElement, options?: ToastOptions) {
  // không chỉ định hoặc chỉ định là true
  const autoClose = options?.autoClose === undefined || options.autoClose
  if (autoClose) {
    return setTimeout(() => {
      if (toast) {
        document.getElementById(toastContainerId)?.removeChild(toast)
      }
    }, (options?.duration ?? 3000) + (options?.fadeOut ?? 300))
  }
  return undefined
}

function getHtml(title?: React.ReactNode, content?: React.ReactNode, options?: ToastOptions) {
  const icon = getIcon(options)

  const contentHtml = renderToString(content)
  const titleHtml = renderToString(title)
  const closeIconHtml = renderToString(React.createElement('i', { className: 'fa-solid fa-xmark' }))
  const iconHtml = renderToString(icon)

  return `<div class='toast-icon'>${iconHtml}</div>
  <div class='toast-body'>
    <div class='toast-body-title'>${titleHtml}</div>
    <div class='toast-body-content'>${contentHtml}</div>
  </div>
  <div class='toast-close'>${closeIconHtml}</div>
  `
}

function getIcon(options?: ToastOptions): React.ReactNode {
  // let icon = options?.icon ?? React.createElement('i', { className: 'fa-solid fa-circle-xmark' })
  if (options?.icon) return options.icon
  if (options?.type) {
    switch (options.type) {
      case 'error':
        return React.createElement('i', { className: 'fa-solid fa-circle-xmark' })
      case 'info':
        return React.createElement('i', { className: 'fa-solid fa-circle-info' })
      case 'success':
        return React.createElement('i', { className: 'fa-solid fa-circle-check' })
      case 'warning':
        return React.createElement('i', { className: 'fa-solid fa-triangle-exclamation' })
      case 'waiting':
        return React.createElement('div', { className: 'loader' })
      default:
        return React.createElement(React.Fragment)
    }
  } else {
    return React.createElement(React.Fragment)
  }
}

function getClassName(options?: ToastOptions) {
  const container = document.getElementById(toastContainerId)
  if (!container) return ''
  const containerAnimationDir = container.dataset.position
  return `toast${
    options?.position && options.position !== containerAnimationDir ? ' self-position-toast' : ''
  } toast__${options?.position ?? 'top-right'} ${options?.toastElement?.className || ''} toast__${
    options?.type || 'info'
  } toast__${options?.variant || 'white'}${options?.showTimeLine ? ' toast__show-timeline' : ''}`
}

function getAnimationDirection(position?: ToastPosition) {
  let direction = 'FromRight'

  if (position) {
    if (position.includes('center')) {
      if (position === 'bottom-center') {
        direction = 'FromBottom'
      } else direction = 'FromTop'
    } else {
      if (position.includes('right')) {
        direction = 'FromRight'
      } else if (position.includes('left')) {
        direction = 'FromLeft'
      }
    }
  }

  return direction
}

function setTimeLineCSSVariable(toast: HTMLElement, options?: ToastOptions) {
  if (options?.showTimeLine) {
    toast.style.setProperty('--toast-duration', `${options?.duration ?? '3000'}ms`)
  }
}

export {
  registerCloseButtonClick,
  setStyle,
  getAnimation,
  removeToastAfterTimeOut,
  getHtml,
  getIcon,
  getClassName,
  getAnimationDirection,
  setTimeLineCSSVariable
}
