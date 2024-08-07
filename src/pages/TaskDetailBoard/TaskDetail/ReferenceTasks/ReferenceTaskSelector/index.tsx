import { useProjectSelector } from '@hooks/useProjectSelector'
import { TaskDetailContext } from '@pages/TaskDetailBoard/context'
import { getTasksInProject } from '@utils/functions'
import { TaskResponseForTable } from '@utils/types'
import { useContext, useEffect, useState } from 'react'
import ReferenceTaskSelectorItem from './ReferenceTaskSelectorItem'
import Button from '@comps/Button'
import Flex from '@comps/StyledComponents'

type SelectedTask = {
  id: string
  isSelected: boolean
}

type ReferenceTaskSelectorProps = {
  onConfirmSelect?: (taskIds: string[]) => void
}

function ReferenceTaskSelector({ onConfirmSelect = () => {} }: ReferenceTaskSelectorProps) {
  const { board } = useProjectSelector()
  const [tasks, setTasks] = useState<TaskResponseForTable[]>([])
  const [selectedTasks, setSelectedTasks] = useState<SelectedTask[]>([])
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
    // if (selectedTasksToAdd?.length > 0 && context?.task?.id) {
    //   const res = await addDependencies(
    //     context?.task?.id,
    //     selectedTasksToAdd.map(s => s.id)
    //   )
    //   if (res?.isSuccess) {
    //     // add dependencies
    //   }
    // }
  }
  const context = useContext(TaskDetailContext)
  useEffect(() => {
    setTasks(getTasksInProject(board.lists))
  }, [board])
  return (
    <>
      <div className='reference-tasks-selector'>
        {tasks.map(task => (
          <>
            {task.id !== context?.task?.id && (
              <ReferenceTaskSelectorItem key={task.id} onTaskSelect={handleSelectTasks} task={task} />
            )}
          </>
        ))}
      </div>
      <Flex $alignItem='center' $justifyContent='end'>
        <Button onClick={handleSubmitTasks}>Add</Button>
      </Flex>
    </>
  )
}

export default ReferenceTaskSelector
