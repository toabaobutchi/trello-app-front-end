import { useState } from 'react'
import './UpdateTaskNameEditor.scss'
import Button from '@comps/Button'
import Flex from '@comps/StyledComponents/Flex'
import { HubConnection } from '@microsoft/signalr'
import { TaskDetailForBoard } from '@utils/types'
import { hubs } from '@utils/Hubs'

type UpdateTaskNameEditorProps = {
  task?: TaskDetailForBoard
  hubConnection?: HubConnection
  onUpdateTaskName?: (taskName: string) => void
}

function UpdateTaskNameEditor({ task, onUpdateTaskName = () => {}, hubConnection }: UpdateTaskNameEditorProps) {
  const [name, setName] = useState<string>()
  const handleToggle = () => {
    setName(name !== undefined ? undefined : task?.name)
    if (hubConnection) {
      if (name === undefined) {
        // SendStartUpdateTaskInfo
        hubConnection.invoke(hubs.project.send.startUpdateTaskInfo, task?.id)
      }
      // SendCancelUpdateTaskInfo
      else hubConnection.invoke(hubs.project.send.cancelUpdateTaskInfo, task?.id)
    }
  }
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  const handleUpdate = () => {
    if (name) {
      onUpdateTaskName(name)
      setName(undefined)
    }
  }
  return (
    <>
      {name === undefined ? (
        <h2 onClick={handleToggle} className='task-details-name'>
          {task?.name}
        </h2>
      ) : (
        <>
          <Flex $alignItem='center' $gap='1rem'>
            <input
              className='input-change-task-name'
              id='change-task-name-input'
              value={name}
              onChange={handleChangeName}
            />
            <Button onClick={handleUpdate}>
              <i className='fa-solid fa-pen-to-square'></i> Update
            </Button>
            <Button onClick={handleToggle} theme='danger'>
              <i className='fa-solid fa-xmark'></i> Cancel
            </Button>
          </Flex>
        </>
      )}
    </>
  )
}

export default UpdateTaskNameEditor
