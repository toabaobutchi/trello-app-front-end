import { TaskDetailForBoard } from '@utils/types/task.type'
import { createContext } from 'react'

export type TaskDetailContextType = {
  task?: TaskDetailForBoard
  setTask?: React.Dispatch<React.SetStateAction<TaskDetailForBoard | undefined>>
}

export const TaskDetailContext = createContext<TaskDetailContextType | undefined>(undefined)
