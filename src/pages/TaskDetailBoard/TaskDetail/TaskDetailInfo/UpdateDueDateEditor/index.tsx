import Flex from '@comps/StyledComponents'
import './UpdateDueDateEditor.scss'
import DatePicker from '@comps/DatePicker'
import Button from '@comps/Button'

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
        <p>
          {dueDate ? (
            <Flex $alignItem='center' $gap='0.25rem'>
              <p>{new Date(dueDate).toLocaleDateString()}</p>
              <Button variant='outlined' theme='danger' size='small'>
                Reset <i className='fa-solid fa-xmark'></i>
              </Button>
            </Flex>
          ) : (
            <span className='text-light'>[Not set]</span>
          )}
        </p>
        <DatePicker date={dueDate} onDateChange={handleDateChange} id='change-due-date-input' />
      </Flex>
    </>
  )
}

export default UpdateDueDateEditor
