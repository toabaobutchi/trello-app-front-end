import { TaskResponseForBoard } from './types'

export const isOutClick = (parent: HTMLElement, child: HTMLElement | null) => {
  return parent && !parent.contains(child as Node)
}

export function createCardId(task: TaskResponseForBoard) {
  return task.id
}

export function indexComparer(
  {
    index: aIndex,
    createdAt: aCreatedAt,
    updatedAt: aUpdatedAt
  }: { index: number; createdAt: number; updatedAt?: number },
  {
    index: bIndex,
    createdAt: bCreatedAt,
    updatedAt: bUpdatedAt
  }: { index: number; createdAt: number; updatedAt?: number }
) {
  if (aIndex !== bIndex) {
    return aIndex - bIndex
  } else {
    // ai cập nhật sau thì có thời gian kéo vào lớn hơn, sẽ được đặt phía trước (được xem là nhỏ hơn)
    return (bUpdatedAt ?? bCreatedAt) - (aUpdatedAt ?? aCreatedAt)
  }
}

export function getSlug(slug: string) {
  const lastHyphenIndex = slug.lastIndexOf('-')
  return lastHyphenIndex === -1? slug : slug.slice(0, lastHyphenIndex)
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
