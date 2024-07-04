import Button from '@comps/Button'
import SelectList from '@comps/SelectList'
import PriorityTag from '@comps/TaskCard/PriorityTag'
import { useState } from 'react'

type UpdatePriorityEditorProps = {
  priority?: string
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
function UpdatePriorityEditor({ priority, onUpdate = () => {} }: UpdatePriorityEditorProps) {
  const [priorityValue, setPriorityValue] = useState<string>()
  const handleToggleEditor = () => {
    setPriorityValue(priorityValue !== undefined ? undefined : priority)
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
