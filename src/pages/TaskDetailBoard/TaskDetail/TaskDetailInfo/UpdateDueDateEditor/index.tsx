import Flex from '@comps/StyledComponents'
import './UpdateDueDateEditor.scss'
import DatePicker from '@comps/DatePicker'

type UpdateDueDateEditorProps = {
  dueDate?: number
  onUpdate?: (date: number) => void
}

function UpdateDueDateEditor({ dueDate, onUpdate = () => {} }: UpdateDueDateEditorProps) {
  const handleDateChange = (date: number) => {
    onUpdate(date)
  }
  return (
    <>
      <Flex $alignItem='center' $gap='0.5rem'>
        <p>{dueDate ? <>{new Date(dueDate).toLocaleDateString()}</> : <span className='text-light'>[Not set]</span>}</p>
        <DatePicker date={dueDate} onDateChange={handleDateChange} id='change-due-date-input' />
      </Flex>
    </>
  )
}

export default UpdateDueDateEditor
