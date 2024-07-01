import Button from '@comps/Button'
import MultipleInput from '@comps/MultipleInput'
import Flex from '@comps/StyledComponents/Flex'
import { useState } from 'react'

function AddSubtask({ onAddTask }: { onAddTask: (values: string[]) => void }) {
  const [texts, setTexts] = useState<string[]>([])
  const [openInput, setOpenInput] = useState(false)
  const handleToggle = () => {
    setOpenInput(!openInput)
    setTexts([])
  }
  const handleDelele = (index: number) => {
    setTexts(texts.filter((_, i) => i !== index))
  }
  const handleAddTask = () => {
    if (texts.length) {
      onAddTask(texts)
    }
    handleToggle()
  }
  const handleTrigger = (value: string) => {
    setTexts([...texts, value])
  }
  return (
    <>
      {!openInput ? (
        <Button onClick={handleToggle} variant='filled' className='mt-1'>
          Add new subtask
        </Button>
      ) : (
        <>
          <MultipleInput
            label='Subtask name'
            values={texts}
            valueBoxVariant='outlined'
            onTrigger={handleTrigger}
            onDelete={handleDelele}
            input={{ autoFocus: true, id: 'add-new-subtasks-input' }}
          />
          <Flex $alignItem='center' $gap='0.5rem' className='mt-1'>
            <Button onClick={handleAddTask}>
              <i className='fa-solid fa-plus'></i> Add
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

export default AddSubtask
