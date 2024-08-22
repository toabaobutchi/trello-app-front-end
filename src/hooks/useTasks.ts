import { useEffect, useState } from 'react'
import { useProjectSelector } from './useProjectSelector'
import { TaskResponseForBoard } from '@utils/types/task.type'

export default function useTasks() {
  const { board, changeId } = useProjectSelector()
  const [tasks, setTasks] = useState<TaskResponseForBoard[]>()
  useEffect(() => {
    const handleGetTasks = () => {
      if (board?.id) {
        let tasks = [] as TaskResponseForBoard[]
        board?.lists?.forEach(l => {
          tasks = tasks.concat(l?.tasks?.map(t => t) as TaskResponseForBoard[])
        })
        return tasks
      }
      return [] as TaskResponseForBoard[]
    }
    if (board?.id) {
      const newTasks = handleGetTasks()
      setTasks(newTasks)
    }
  }, [board?.id, changeId])
  return tasks
}
