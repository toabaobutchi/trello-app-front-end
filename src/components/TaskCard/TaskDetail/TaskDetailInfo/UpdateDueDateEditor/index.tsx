import Flex from '@comps/StyledComponents/Flex'
import './UpdateDueDateEditor.scss'
import { useRef } from 'react'

type UpdateDueDateEditorProps = {
  dueDate?: number
  onUpdate?: (date: Date) => void
}

function UpdateDueDateEditor({ dueDate, onUpdate = () => {} }: UpdateDueDateEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const handleTogglePicker = () => {
    if (inputRef?.current) {
      inputRef.current.showPicker()
      // inputRef.current.togglePopover();
    }
  }
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value)
    if (date.toString() !== 'Invalid Date') {
      onUpdate(date)
    }
  }
  return (
    <>
      <Flex $alignItem='center' $gap='0.5rem'>
        <p>{dueDate ? <>{new Date(dueDate).toLocaleDateString()}</> : <span className='text-light'>[Not set]</span>}</p>
        <input
          ref={inputRef}
          onChange={handleDateChange}
          type='datetime-local'
          name='dueDatePicker'
          id='due-date-picker'
        />
        <label onClick={handleTogglePicker} htmlFor='due-date-picker' className='change-due-date-button'>
          <i className='fa-regular fa-calendar-plus'></i>
        </label>
      </Flex>
    </>
  )
}

export default UpdateDueDateEditor
