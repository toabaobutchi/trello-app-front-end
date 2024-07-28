import Button from '@comps/Button'
import Flex from '@comps/StyledComponents/Flex'
import { AssignmentResponse } from '@utils/types'
import { useState } from 'react'

type AssignmentMemberItemProps = {
  member: AssignmentResponse
  onSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function AssignmentMemberItem({ member, onSelect = () => {} }: AssignmentMemberItemProps) {
  const [isSelected, setIsSelected] = useState(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSelected(e.target.checked)
    onSelect(e)
  }
  return (
    <>
      <input
        type='checkbox'
        name='assign-options'
        id={`assign-option-${member.id}`}
        className='assign-options-checkbox'
        checked={isSelected}
        value={member.id}
        onChange={handleChange}
      />
      <label
        htmlFor={`assign-option-${member.id}`}
        key={member.id}
        className={`assignee-item ${isSelected ? 'selected' : ''}`}
      >
        <Flex $alignItem='center' $justifyContent='space-between' $gap='1rem'>
          <Flex $alignItem='center' $gap='0.25rem'>
            <img src={member.avatar} alt='avatar' />
            <div className='assignee-item-info'>
              <p className='assignee-item-info-name'>{member.displayName}</p>
              <p className='assignee-item-info-email'>{member.email}</p>
            </div>
          </Flex>
          {isSelected && (
            <span className='text-success bold'>
              Selected
              <i className='fa-solid fa-check fa-fw'></i>
            </span>
          )}
        </Flex>
      </label>
    </>
  )
}

export default AssignmentMemberItem
