import Button from '@comps/Button'
import DatePicker from '@comps/DatePicker'
import Flex from '@comps/StyledComponents'
import { getDateString } from '@utils/functions'
import { ResetTaskModel } from '@utils/types'

type UpdateStartDateEditorProps = {
  startDate?: number
  onUpdate?: (date: number) => void
  onClear?: (model: ResetTaskModel) => void
}

function UpdateStartDateEditor({ startDate, onUpdate = () => {}, onClear = () => {} }: UpdateStartDateEditorProps) {
  const handleDateChange = (date: number) => {
    if (onUpdate) {
      onUpdate(date)
    }
  }
  const handleClear = () => {
    if (onClear) {
      onClear({ resetStartDate: true })
    }
  }
  return (
    <>
      <Flex $alignItem='center' $gap='0.5rem'>
        <p className='row gap-2'>
          {startDate ? (
            <>
              {getDateString(new Date(startDate))}{' '}
              <Button onClick={handleClear} size='small' variant='outlined' theme='danger'>
                Reset <i className='fa-solid fa-xmark'></i>
              </Button>
            </>
          ) : (
            <span className='text-secondary'>[Not set (Default is creation time)]</span>
          )}
        </p>
        <DatePicker date={startDate} onDateChange={handleDateChange} id='change-start-date-input' />
      </Flex>
    </>
  )
}

export default UpdateStartDateEditor
