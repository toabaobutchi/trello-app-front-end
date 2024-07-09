import type { PointerEvent } from 'react'
import { PointerSensor } from '@dnd-kit/core'

export class MyCustomSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown' as const,
      handler: ({ nativeEvent: event }: PointerEvent) => {
        const target = event.target as HTMLElement
        if (target?.classList.contains('modal') || target?.classList.contains('menu')) {
          return false
        }
        return true
      }
    }
  ]
}
