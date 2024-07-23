import { cloneDeep } from 'lodash'
import { FilterType, ListResponseForBoard, ProjectResponseForBoard, TaskResponseForBoard } from './types'

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
  // nếu khác thì so sánh index thôi, không cần xét đến updated time / created time
  if (aIndex !== bIndex) {
    return aIndex - bIndex
  } else {
    // ai cập nhật sau thì có thời gian kéo vào lớn hơn, sẽ được đặt phía trước (được xem là nhỏ hơn)
    return (aUpdatedAt ?? aCreatedAt) - (bUpdatedAt ?? bCreatedAt)
  }
}

export function getSlug(slug: string) {
  const lastHyphenIndex = slug.lastIndexOf('-')
  return lastHyphenIndex === -1 ? slug : slug.slice(0, lastHyphenIndex)
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

export function sortProject(project?: ProjectResponseForBoard) {
  if (!project) return project
  const listOrder = project?.listOrder?.split(',')
  project.lists = project?.lists?.sort((a, b) => (listOrder?.indexOf(a.id) ?? 0) - (listOrder?.indexOf(b.id) ?? 0))
  project.lists?.forEach(list => {
    const taskOrder = list.taskOrder?.split(',')
    list.tasks = list?.tasks?.sort((a, b) => (taskOrder?.indexOf(a.id) ?? 0) - (taskOrder?.indexOf(b.id) ?? 0))
  })
  return project
}

export function sortList(list?: ListResponseForBoard[], order?: string) {
  if (!list) return list
  const updatedListOrder = order?.split(',')
  list = list?.sort((a, b) => (updatedListOrder?.indexOf(a.id) ?? 0) - (updatedListOrder?.indexOf(b.id) ?? 0))
  return list
}
export const sortTask = (tasks?: TaskResponseForBoard[], order?: string) => {
  if (!tasks) return tasks
  const updatedTaskOrder = order?.split(',')
  tasks = tasks?.sort((a, b) => (updatedTaskOrder?.indexOf(a.id) ?? 0) - (updatedTaskOrder?.indexOf(b.id) ?? 0))
  return tasks
}

export const mapOrder = <T>(originalArray?: T[], orderArray?: string[], key?: string) => {
  if (!originalArray || !orderArray || !key) return []
  const clonedArray = [...originalArray]
  const orderedArray = clonedArray.sort((a, b) => {
    return orderArray.indexOf(a[key]) - orderArray.indexOf(b[key])
  })
  return orderedArray
}

export const getDateTimeString = (date: Date) => {
  if (!date) return ''
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(
    2,
    '0'
  )} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`.replace(' ', 'T')
}

export const filterLists = (lists?: ListResponseForBoard[], filters?: FilterType) => {
  if (!lists) return []
  if (!filters?.isFiltering) return lists
  const { priorities, noAssigneesFilter, dueDate, overDueFilter } = filters
  const newList = cloneDeep(lists)
  newList?.forEach(list => {
    list!.tasks = list?.tasks?.filter(task => {
      if (
        priorities &&
        priorities.length > 0 &&
        priorities.findIndex(priority => priority.value === (task.priority ?? '')) === -1
      )
        return false
      // if (members && members.findIndex(member => member.value === task.) === -1) return false
      if (noAssigneesFilter && task.assigneeCount !== 0) return false
      if (dueDate && task.dueDate && task.dueDate > dueDate) return false
      if (overDueFilter && task.dueDate && new Date(task.dueDate) > new Date()) return false
      return true
    })
  })
  return newList
}

export const getDisplayDateString = (date: Date) => {
  if (!date) return ''
  const today = new Date()
  const yesterday = new Date(today.getTime() - 24 * 60 * 60)
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60)
  if (date.getTime() === today.getTime()) return 'Today'
  if (date.getTime() === yesterday.getTime()) return 'Yesterday'
  if (date.getTime() === tomorrow.getTime()) return 'Tomorrow'
  return date.toLocaleDateString()
}

export const getDateString = (date: Date, includeTime: boolean = false) => {
  if (!date) return ''
  const dateString = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getFullYear()}`
  if (includeTime)
    return (
      dateString +
      ` ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${
        date.getHours() > 12 ? 'PM' : 'AM'
      }`
    )
  else return dateString
}

export const handleTriggerKeyPress = <TElement = HTMLInputElement>(
  callback: (e: React.KeyboardEvent<TElement>) => void,
  ...triggerKeys: string[]
) => {
  return {
    handler: (e: React.KeyboardEvent<TElement>) => {
      if (triggerKeys.includes(e.key)) {
        callback(e)
      }
    }
  }
}

export const getCommentTime = (commentTime: number) => {
  const commentDate = new Date(commentTime)
  const currentDate = new Date()
  const diffTime = currentDate.getTime() - commentDate.getTime()
  const diffMinutes = Math.floor(diffTime / (1000 * 60))
  if (diffMinutes < 60)
    return {
      diff: diffMinutes,
      unit: 'minute'
    }
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays > 0) {
    return {
      diff: diffDays,
      unit: 'day'
    }
  } else {
    return {
      diff: Math.floor(diffTime / (1000 * 60 * 60)),
      unit: 'hour'
    }
  }
}

export function filterBySearchName<T extends { id: string }>(array?: T[], keys?: (keyof T)[], searchName?: string) {
  if (!array || !keys || keys.length <= 0) return []
  if (!searchName) return array
  let newArray = [] as T[]
  keys.forEach(key => {
    newArray.push(...array.filter(item => (item[key] as string).toLowerCase().includes(searchName.toLowerCase())))
  })
  newArray = Array.from(new Map(newArray.map(item => [item.id, item])).values())
  return newArray
}
export enum DateCompareState {
  Normal,
  Overdue,
  DueSoon
}
export function isOverdue(date?: number) {
  if (!date) return DateCompareState.Normal
  // console.log(getDateString(new Date(date)))
  const diff = date - new Date().getTime()
  const diffDays = Math.floor(diff / (24 * 60 * 60 * 1000))
  if (diffDays > 0 && diffDays <= 1) {
    return DateCompareState.DueSoon
  } else if (diffDays < 0) {
    // console.log('Overdue')
    return DateCompareState.Overdue
  }
  return DateCompareState.Normal
}

export function isInToday(date: number) {
  const today = new Date()
  const taskDate = new Date(date)
  return (
    today.getFullYear() === taskDate.getFullYear() &&
    today.getMonth() === taskDate.getMonth() &&
    today.getDate() === taskDate.getDate()
  )
}
