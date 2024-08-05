import DatePicker from '@comps/DatePicker'
import Flex from '@comps/StyledComponents'
import { useState } from 'react'

type UpdateStartDateEditorProps = {
  startDate?: number
  onUpdate?: (date: number) => void
  onClear?: () => void
}

function UpdateStartDateEditor({ startDate, onUpdate = () => {}, onClear = () => {} }: UpdateStartDateEditorProps) {
  const handleDateChange = (date: number) => {
    if (onUpdate) {
      onUpdate(date)
    }
  }
  return (
    <>
      <Flex $alignItem='center' $gap='0.5rem'>
        <p>
          {startDate ? (
            <>{new Date(startDate).toLocaleDateString()}</>
          ) : (
            <span className='text-light'>[Not set (Default is creation time)]</span>
          )}
        </p>
        <DatePicker date={startDate} onDateChange={handleDateChange} id='change-start-date-input' />
      </Flex>
    </>
  )
}

export default UpdateStartDateEditor
