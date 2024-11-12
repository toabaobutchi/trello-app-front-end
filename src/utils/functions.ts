import { cloneDeep } from 'lodash'
import { AssignmentResponse } from './types/assignment.type'
import { ProjectFilterType } from './types'
import { ListResponseForBoard } from './types/list.type'
import { ProjectResponseForBoard } from './types/project.type'
import { TaskResponseForBoard, TaskResponseForTable } from './types/task.type'

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

export const mapOrder = <T>(originalArray?: T[], orderArray?: string[], key?: keyof T) => {
  if (!originalArray || !orderArray || !key) return []
  const clonedArray = [...originalArray]
  const orderedArray = clonedArray.sort((a, b) => {
    return orderArray.indexOf(a[key] as string) - orderArray.indexOf(b[key] as string)
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

export const filterLists = (lists?: ListResponseForBoard[], filters?: ProjectFilterType) => {
  if (!lists) return []
  if (!filters) return lists

  const { priorities, noAssigneesFilter, dueDate, members, assignToMe, overdue, dueSoon, needHelp, completed } = filters

  const newList = cloneDeep(lists)
  newList?.forEach(list => {
    list!.tasks = list?.tasks?.filter(task => {
      if (
        priorities &&
        priorities.length > 0 && // có lọc theo độ ưu tiên
        priorities.findIndex(priority => priority.value === (task.priority ?? '')) === -1 // nếu không tìm thấy thì không cần tiếp tục
      )
        return false

      // lọc theo thành viên nhóm
      const memberIds = members?.map(m => m.value)
      if (memberIds && !task.taskAssignmentIds.some(id => memberIds.includes(id))) return false

      // lọc theo các task đã giao cho tôi
      if (assignToMe && !task.taskAssignmentIds.includes(assignToMe)) return false

      // có lọc theo tuỳ chọn task không có thành viên thực hiện
      if (noAssigneesFilter && task.taskAssignmentIds.length > 0) return false

      // có lọc theo thời gian đến hạn, bỏ qua các task không có `dueDate`
      if (dueDate && task.dueDate && task.dueDate > dueDate) return false

      if (overdue && task.dueDate && !(isOverdue(task.dueDate) === DateCompareState.Overdue)) return false

      if (dueSoon && task.dueDate && !(isOverdue(task.dueDate) === DateCompareState.DueSoon)) return false

      if (completed && !task.isCompleted) return false

      if (needHelp && !task.isMarkedNeedHelp) return false

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

export const getTaskAssignments = (
  taskAssignmentIds?: string[],
  members?: AssignmentResponse[]
): AssignmentResponse[] => {
  if (!taskAssignmentIds || !members) {
    return []
  }
  const assignments = members.filter(m => taskAssignmentIds.includes(m.id))
  return assignments
}
export const getRestAssignments = (
  taskAssignmentIds?: string[],
  members?: AssignmentResponse[]
): AssignmentResponse[] => {
  if (!taskAssignmentIds || !members) {
    return []
  }
  const assignments = members.filter(m => !taskAssignmentIds.includes(m.id))
  return assignments
}

export const getMiliseconds = (date: Date): number => {
  const offset = date.getTimezoneOffset() / -60
  return date.getTime() + offset * 60 * 60 * 1000
}

export const autoDetectLinks = (str: string) => {
  // Regex để tìm các link
  const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi

  // Thay thế mỗi link bằng thẻ <a>
  return str.replace(urlPattern, '<a target="_blank" href="$1">$1</a>')
}

export const getTasksInProject = (lists?: ListResponseForBoard[]) => {
  if (!lists) return []
  let task = [] as TaskResponseForTable[]
  lists?.forEach(list => {
    task = task.concat(
      list?.tasks?.map(t => ({ ...t, listName: list.name } as TaskResponseForTable)) as TaskResponseForTable[]
    )
  })
  return task
}

export const getFlatTasks = (project?: ProjectResponseForBoard) => {
  if (!project) return []
  return project.lists?.flatMap<TaskResponseForBoard>(l => l?.tasks ?? [])
}

export function containsSpecialCharacters(str: string) {
  const specialCharactersPattern = /[!@#$%^&*(),.?":{}|<>]/g
  return specialCharactersPattern.test(str)
}

export function isAdminOrOwner(context: string) {
  const permission = context.toLowerCase()
  return permission === 'admin' || permission === 'owner'
}
export function getColor() {
  return '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0')
}

export function stopPropagation<TEvent extends React.SyntheticEvent>(e: TEvent) {
  e.stopPropagation()
}

export function outClickHandler(
  trackedSelector: string | (HTMLElement | null),
  handler?: (event: EventTarget | null) => void,
  excludeIds?: string[]
) {
  return function (e: MouseEvent) {
    const trackedElement =
      typeof trackedSelector === 'string'
        ? document.getElementById(trackedSelector.replaceAll('#', ''))
        : trackedSelector
    if (trackedElement && !trackedElement.contains(e.target as Node)) {
      let isClickOnExcludesElement = false
      const clickedElement = e.target as HTMLElement
      if (excludeIds && excludeIds.length > 0) {
        excludeIds.forEach(selector => {
          if (clickedElement.closest(selector)) {
            isClickOnExcludesElement = true
            return
          }
        })
      }
      // click bên ngoài phần tử đang xét và cũng không click vào phần tử ngoại lệ
      if (!isClickOnExcludesElement) {
        handler?.(e.target)
      }
    }
  }
}

export const clickOutsideTrigger = <TElement extends HTMLElement = HTMLElement>(
  ref: React.RefObject<TElement> | React.RefObject<TElement>[],
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  return (event: MouseEvent | TouchEvent) => {
    const target = event.target as Node
    if (!target || !target.isConnected) return

    const isClickOutside = Array.isArray(ref)
      ? ref.filter(r => r.current).every(r => r.current && !r.current.contains(target))
      : ref.current && !ref.current.contains(target)

    if (isClickOutside) {
      handler(event)
    }
  }
}
