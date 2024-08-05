import Flex from '@comps/StyledComponents'
import { useRef, useState } from 'react'
import './DatePicker.scss'
import { getDateTimeString, getMiliseconds } from '@utils/functions'

type DatePickerProps = {
  onDateChange?: (date: number) => void
  date?: number
} & React.ComponentProps<'input'>

function DatePicker({ date, onDateChange = () => {}, ...props }: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState(date ?? Date.now())
  const handleTogglePicker = () => {
    if (inputRef?.current) {
      inputRef.current.showPicker()
    }
  }
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value)
    setValue(getMiliseconds(date))
    if (date.toString() !== 'Invalid Date') {
      onDateChange(getMiliseconds(date))
    }
  }
  if (!props?.id) {
    console.error('id prop is required for DatePicker component')
    return <></>
  }
  return (
    <>
      <Flex $alignItem='center' $gap='0.5rem'>
        <input
          ref={inputRef}
          {...props}
          onChange={handleDateChange}
          type={props?.type ?? 'datetime-local'}
          className={`date-picker-input ${props?.className ?? ''}`}
          value={getDateTimeString(new Date(value))}
        />
        <label onClick={handleTogglePicker} htmlFor={props?.id} className='change-date-button'>
          <i className='fa-regular fa-calendar-plus'></i>
        </label>
      </Flex>
    </>
  )
}

export default DatePicker
