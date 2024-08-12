import Button from '@comps/Button'
import Flex from '@comps/StyledComponents'

type CalendarSelectorProps = {
  date: moment.Moment
  onChange?: (addWeek: number) => void
}

const dateFormat = 'dddd DD-MM-YYYY'

function CalendarSelector({ date, onChange = () => {} }: CalendarSelectorProps) {
  const handlePreviousClick = () => {
    onChange(-1)
  }
  const handleNextClick = () => {
    onChange(1)
  }
  return (
    <>
      <div className='calendar-selector'>
        <Button onClick={handlePreviousClick} variant='text'>
          <i className='fa-solid fa-angle-left'></i>
        </Button>

        <Flex $alignItem='center' $gap='0.5rem'>
          <p className='calendar-selector-start-date'>{date.startOf('week').format(dateFormat)}</p>
          <span>
            <i className='fa-solid fa-arrow-right-long'></i>
          </span>
          <p className='calendar-selector-end-date'>{date.endOf('week').format(dateFormat)}</p>
        </Flex>

        <Button onClick={handleNextClick} variant='text'>
          <i className='fa-solid fa-angle-right'></i>
        </Button>
      </div>
    </>
  )
}

export default CalendarSelector
