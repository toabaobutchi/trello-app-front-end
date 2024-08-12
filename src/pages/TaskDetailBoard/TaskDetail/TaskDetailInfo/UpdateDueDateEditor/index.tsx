import Flex from '@comps/StyledComponents'
import './UpdateDueDateEditor.scss'
import DatePicker from '@comps/DatePicker'
import Tooltip from '@comps/Tooltip-v2'
import IconButton from '@comps/IconButton'
import { ResetTaskModel } from '@utils/types'
import { getDateString } from '@utils/functions'

type UpdateDueDateEditorProps = {
  dueDate?: number
  onUpdate?: (date: number) => void
  onClear?: (model: ResetTaskModel) => void
}

function UpdateDueDateEditor({ dueDate, onUpdate = () => {}, onClear = () => {} }: UpdateDueDateEditorProps) {
  const handleDateChange = (date: number) => {
    onUpdate(date)
  }
  const handleClear = () => {
    if (onClear) {
      onClear({ resetDueDate: true })
    }
  }
  return (
    <>
      <Flex $alignItem='center' $gap='0.5rem'>
        <p>
          {dueDate ? (
            <Flex $alignItem='center' $gap='0.5rem'>
              <p>{getDateString(new Date(dueDate))}</p>
              <Tooltip content='Reset due date' position='top' arrow>
                <IconButton onClick={handleClear} dashedBorder size='small' theme='danger' blurWhenNotHover>
                  <i className='fa-solid fa-xmark'></i>
                </IconButton>
              </Tooltip>
            </Flex>
          ) : (
            <span className='text-secondary'>[Not set]</span>
          )}
        </p>
        <DatePicker date={dueDate} onDateChange={handleDateChange} id='change-due-date-input' />
      </Flex>
    </>
  )
}

export default UpdateDueDateEditor
