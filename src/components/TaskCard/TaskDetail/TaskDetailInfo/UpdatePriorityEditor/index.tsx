import Button from '@comps/Button'
import SelectList from '@comps/SelectList'
import PriorityTag from '@comps/TaskCard/PriorityTag'
import { HubConnection } from '@microsoft/signalr'
import { RootState } from '@redux/store'
import { useState } from 'react'
import { useSelector } from 'react-redux'

type UpdatePriorityEditorProps = {
  priority?: string
  taskId?: string
  hubConnection?: HubConnection
  onUpdate?: (priority: string) => void
}
const prioritiesSelectList = [
  {
    value: 'High',
    display: (
      <>
        <PriorityTag priority='High' />
      </>
    )
  },
  {
    value: 'Medium',
    display: (
      <>
        <PriorityTag priority='Medium' />
      </>
    )
  },
  {
    value: 'Normal',
    display: (
      <>
        <PriorityTag priority='Normal' />
      </>
    )
  },
  {
    value: 'Low',
    display: (
      <>
        <PriorityTag priority='Low' />
      </>
    )
  }
]
function UpdatePriorityEditor({ priority, taskId, onUpdate = () => {}, hubConnection }: UpdatePriorityEditorProps) {
  const [priorityValue, setPriorityValue] = useState<string>()
  const projectId = useSelector((state: RootState) => state.project.activeProject.board.id)
  const accountId = useSelector((state: RootState) => state.login.accountInfo.id)
  const handleToggleEditor = () => {
    setPriorityValue(priorityValue !== undefined ? undefined : priority)
    if (hubConnection) {
      if (priorityValue === undefined) {
        hubConnection.invoke('SendStartUpdateTaskInfo', projectId, accountId, taskId)
      } else hubConnection.invoke('SendCancelUpdateTaskInfo', projectId, accountId, taskId)
    }
  }
  const handleChoose = ({ value }: { value: string }) => {
    setPriorityValue(undefined)
    onUpdate(value)
  }
  return (
    <>
      {priorityValue === undefined ? (
        <PriorityTag onClick={handleToggleEditor} priority={priority} />
      ) : (
        <>
          <SelectList size='small' onChoose={handleChoose} items={prioritiesSelectList} selectedValue={priorityValue} />
          <Button onClick={handleToggleEditor} variant='outlined' theme='danger'>
            <i className='fa-solid fa-xmark'></i> Cancel
          </Button>
        </>
      )}
    </>
  )
}

export default UpdatePriorityEditor
