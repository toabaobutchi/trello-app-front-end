import DatePicker from '@comps/DatePicker'
import IconButton from '@comps/IconButton'
import Flex from '@comps/StyledComponents'
import Tooltip from '@comps/Tooltip-v2'
import { getDateString } from '@utils/functions'
import { ResetTaskModel } from '@utils/types/task.type'

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
              <Tooltip content='Reset start date' position='top' arrow>
                <IconButton onClick={handleClear} dashedBorder size='small' theme='danger' blurWhenNotHover>
                  <i className='fa-solid fa-xmark'></i>
                </IconButton>
              </Tooltip>
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
