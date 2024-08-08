import { useProjectSelector } from '@hooks/useProjectSelector'
import { TaskDetailContext } from '@pages/TaskDetailBoard/context'
import { getFlatTasks } from '@utils/functions'
import { ReferenceTasks, TaskResponseForBoard } from '@utils/types'
import { useContext, useEffect, useMemo, useState } from 'react'
import ReferenceTaskSelectorItem from './ReferenceTaskSelectorItem'
import Button from '@comps/Button'
import Flex from '@comps/StyledComponents'

type SelectedTask = {
  id: string
  isSelected: boolean
}

type ReferenceTaskSelectorProps = {
  onConfirmSelect?: (taskIds: string[]) => void
  usedTasks?: ReferenceTasks
}

function ReferenceTaskSelector({ usedTasks, onConfirmSelect = () => {} }: ReferenceTaskSelectorProps) {
  const { board } = useProjectSelector()
  const [tasks, setTasks] = useState<TaskResponseForBoard[]>([])
  const [selectedTasks, setSelectedTasks] = useState<SelectedTask[]>([])
  const context = useContext(TaskDetailContext)

  const usedTaskIds = useMemo(() => {
    const depTasks = usedTasks?.dependencies.map(dt => dt.id) || []
    const childTasks = usedTasks?.childTasks.map(ct => ct.id) || []
    return [...depTasks, ...childTasks]
  }, [usedTasks])

  const handleSelectTasks = (taskId: string, checked: boolean) => {
    setSelectedTasks(prev => {
      const newSelectedTasks = [...prev]
      const selectedTask = newSelectedTasks.find(t => t.id === taskId)
      if (selectedTask) {
        selectedTask.isSelected = checked
      } else {
        newSelectedTasks.push({ id: taskId, isSelected: checked })
      }
      return newSelectedTasks
    })
  }
  const handleSubmitTasks = async () => {
    const selectedTasksToAdd = selectedTasks.filter(t => t.isSelected)
    onConfirmSelect(selectedTasksToAdd.map(s => s.id))
    setSelectedTasks([]) // reset selected tasks
  }

  useEffect(() => {
    const tasks = getFlatTasks(board)
    setTasks(tasks?.filter(t => !usedTaskIds.includes(t.id) && t.id !== context?.task?.id) || [])
  }, [board, usedTaskIds, context])
  return (
    <>
      <div className='reference-tasks-selector'>
        {tasks.map(task => {
          // loại ra task đang xem và các task đã sử dụng như dependency và children, chỉ giữ lại các task chưa có quan hệ
          return <ReferenceTaskSelectorItem key={task.id} onTaskSelect={handleSelectTasks} task={task} />
        })}
      </div>
      {tasks.length <= 0 && (
        <p className='warning-box'>
          <i className='fa-solid fa-triangle-exclamation'></i> No task can be used as dependencies or children
        </p>
      )}
      <Flex $alignItem='center' $justifyContent='end' className='mt-1'>
        <Button onClick={handleSubmitTasks}>Add</Button>
      </Flex>
    </>
  )
}

export default ReferenceTaskSelector
