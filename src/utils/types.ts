import { ListResponseForBoard } from './types/list.type'

export interface CustomizablePropType {
  content?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  customHtmlAttributes?: object
}

export type DragOverResult = {
  overList?: ListResponseForBoard
  activeList: ListResponseForBoard
}

export type InputChange = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

export type SelectListItem = {
  value: string
  display?: React.ReactNode
}

export type ProjectFilterType = {
  priorities?: SelectListItem[]
  members?: SelectListItem[]
  noAssigneesFilter?: boolean
  assignToMe?: string
  dueDate?: number
  overdue?: boolean
  completed?: boolean
  needHelp?: boolean
  dueSoon?: boolean
}

export type RemoteDraggingType = {
  isDragging?: boolean
  subId?: string
  dragObjectId?: string
  dragObject?: 'Column' | 'Card'
}
