import type { PointerEvent } from 'react'
import { PointerSensor } from '@dnd-kit/core'

export class MyCustomSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown' as const,
      handler: ({ nativeEvent: event }: PointerEvent) => {
        if ((event.target as HTMLElement)?.classList.contains('modal')) {
          return false
        }
        return true
      }
    }
  ]
}
