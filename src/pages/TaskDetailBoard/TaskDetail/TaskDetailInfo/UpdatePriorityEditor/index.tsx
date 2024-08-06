import Button from '@comps/Button'
import SelectList from '@comps/SelectList'
import Flex from '@comps/StyledComponents'
import PriorityTag from '@comps/TaskCard/PriorityTag'
import { HubConnection } from '@microsoft/signalr'
import { hubs } from '@utils/Hubs'
import { ResetTaskModel } from '@utils/types'
import { useState } from 'react'

type UpdatePriorityEditorProps = {
  priority?: string
  taskId?: string
  hubConnection?: HubConnection
  onUpdate?: (priority: string) => void
  onClear?: (model: ResetTaskModel) => void
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
  },
  { value: 'unset', display: <p className='text-secondary'>Reset</p> }
]
function UpdatePriorityEditor({
  priority,
  taskId,
  onUpdate = () => {},
  hubConnection,
  onClear = () => {}
}: UpdatePriorityEditorProps) {
  const [priorityValue, setPriorityValue] = useState<string>()
  const handleToggleEditor = () => {
    setPriorityValue(priorityValue !== undefined ? undefined : priority)
    if (hubConnection) {
      if (priorityValue === undefined) {
        // SendStartUpdateTaskInfo
        hubConnection.invoke(hubs.project.send.startUpdateTaskInfo, taskId)
      }
      // SendCancelUpdateTaskInfo
      else hubConnection.invoke(hubs.project.send.cancelUpdateTaskInfo, taskId)
    }
  }
  const handleChoose = ({ value }: { value: string }) => {
    setPriorityValue(undefined)
    if (value !== 'unset') onUpdate(value)
    else onClear({ resetPriority: true })
  }
  return (
    <>
      {priorityValue === undefined ? (
        <PriorityTag onClick={handleToggleEditor} priority={priority} />
      ) : (
        <Flex $alignItem='center' $gap='0.25rem'>
          <SelectList
            className='priorities-select-list'
            size='small'
            onChoose={handleChoose}
            items={prioritiesSelectList}
            selectedValue={priorityValue}
          />
          <Button onClick={handleToggleEditor} variant='outlined' theme='danger'>
            <i className='fa-solid fa-xmark'></i> Cancel
          </Button>
        </Flex>
      )}
    </>
  )
}

export default UpdatePriorityEditor
