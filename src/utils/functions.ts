import { TaskResponseForBoard } from './types'

export const isOutClick = (parent: HTMLElement, child: HTMLElement | null) => {
  return parent && !parent.contains(child as Node)
}

export function createCardId(task: TaskResponseForBoard) {
  return task.id
}

type OverflowInfo = {
  isOverflow: boolean
  diff: number
}

type OverflowResult = {
  vertical?: OverflowInfo
  horizontal?: OverflowInfo
}

export const isOutOfScreen = (element: HTMLElement) => {
  const overFlowResult: OverflowResult = {}
  const { bottom, right } = element.getBoundingClientRect()
  const { innerHeight, innerWidth } = window
  overFlowResult.vertical = {
    isOverflow: bottom > innerHeight,
    diff: bottom - innerHeight
  }
  overFlowResult.horizontal = {
    isOverflow: right > innerWidth,
    diff: right - innerWidth
  }
  return overFlowResult
}
