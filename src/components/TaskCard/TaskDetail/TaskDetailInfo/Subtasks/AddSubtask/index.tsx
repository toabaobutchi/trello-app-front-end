import Button from '@comps/Button'
import FloatLabelInput from '@comps/FloatLabelInput'
import Flex from '@comps/StyledComponents/Flex'
import { useState } from 'react'

function AddSubtask({ onAddTask }: { onAddTask: (value: string) => void }) {
  const [text, setText] = useState<string>()
  const handleToggle = () => {
    setText(text == undefined ? '' : undefined)
  }
  const handleAddTask = () => {
    if (text) {
      onAddTask(text)
    }
    handleToggle()
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }
  return (
    <>
      {text === undefined ? (
        <Button onClick={handleToggle} variant='filled' className='mt-1'>
          Add new subtask
        </Button>
      ) : (
        <>
          <FloatLabelInput onChange={handleInputChange} label='Subtask name' className='mt-1' input={{ autoFocus: true, value: text, id: 'add-new-subtask' }} />
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
