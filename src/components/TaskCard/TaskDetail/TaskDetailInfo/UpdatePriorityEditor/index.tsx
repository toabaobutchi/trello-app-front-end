import Button from '@comps/Button'
import SelectList from '@comps/SelectList'
import PriorityTag from '@comps/TaskCard/PriorityTag'
import { HubConnection } from '@microsoft/signalr'
import { hubs } from '@utils/Hubs'
import { useState } from 'react'

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
  const handleToggleEditor = () => {
    setPriorityValue(priorityValue !== undefined ? undefined : priority)
    if (hubConnection) {
      if (priorityValue === undefined) {
        // SendStartUpdateTaskInfo
        hubConnection.invoke(hubs.project.send.startUpdateTaskInfo, taskId)
      }
      // SendCancelUpdateTaskInfo
      else hubConnection.invoke(hubs.project.send.startUpdateTaskInfo, taskId)
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
