import Button from '@comps/Button'
import FloatLabelInput from '@comps/FloatLabelInput'
import Flex from '@comps/StyledComponents/Flex'
import useClickTracker from '@hooks/useClickTracker'
import { InputChange } from '@utils/types'
import { useEffect, useRef, useState } from 'react'

function AddTask() {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const handleToggleAddTask = () => {
    setIsAddingTask(!isAddingTask)
  }
  return (
    <>
      {!isAddingTask ? (
        <Button variant='text' onClick={handleToggleAddTask}>
          <i className='fa-solid fa-plus'></i> Add a task ...
        </Button>
      ) : (
        <AddTaskInput onCancelAddTask={handleToggleAddTask} />
      )}
    </>
  )
}

function AddTaskInput({ onCancelAddTask }: { onCancelAddTask: () => void }) {
  const [addTask, setAddTask] = useState<string>('')
  const handleChangeTaskName = (e: InputChange) => {
    setAddTask(e.target.value)
  }
  const addTaskInputContainerRef = useRef<HTMLDivElement>(null)
  const {outClick} = useClickTracker(addTaskInputContainerRef.current as HTMLElement)
  useEffect(() => {
    if(outClick.isOutClick) {
      onCancelAddTask()
    }
  }, [onCancelAddTask, outClick])
   return (
    <>
      <Flex ref={addTaskInputContainerRef} $flexDirection='column' $gap='1rem'>
        <FloatLabelInput
          style={{ width: '100%' }}
          label='Task name'
          input={{ autoFocus: true, value: addTask, id: 'add-task-input' }}
          onChange={handleChangeTaskName}
        />
        <Flex $alignItem='center' $gap='0.5rem'>
          <Button variant='filled'>Add task</Button>
          <Button variant='text' theme='default' onClick={onCancelAddTask}>
            <i className='fa-solid fa-xmark'></i>
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

export default AddTask
