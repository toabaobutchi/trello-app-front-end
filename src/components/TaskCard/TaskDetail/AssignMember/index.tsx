import Button from '@comps/Button'
import Flex from '@comps/StyledComponents/Flex'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { TaskDetailForBoard } from '@utils/types'
import { useMemo, useState } from 'react'
import './AssignMember.scss'
import AssignmentMemberItem from './AssignmentMemberItem'

type AssignMemberProps = {
  task: TaskDetailForBoard
  onCloseModal?: () => void
}
type SelectedMember = {
  id: string
  isSelected?: boolean
}

function AssignMember({ task, onCloseModal = () => {} }: AssignMemberProps) {
  const { members } = useProjectSelector()
  const restMembers = useMemo(() => {
    return members.filter(m => !task.taskAssignmentIds?.includes(m.id))
  }, [members, task.taskAssignmentIds])
  const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([])
  const handleSelectMembers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedMemberId = e.target.value
    const isSelected = e.target.checked
    setSelectedMembers(prev => {
      const newSelectedMembers = [...prev]
      const selectedMember = newSelectedMembers.find(m => m.id === selectedMemberId)
      if (selectedMember) {
        selectedMember.isSelected = isSelected
      } else {
        newSelectedMembers.push({ id: selectedMemberId, isSelected })
      }
      return newSelectedMembers
    })
  }
  const handleAssignMembers = () => {
    const selectedMemberIds = selectedMembers.filter(m => m.isSelected).map(m => m.id)

    if (selectedMemberIds?.length > 0) {
      // call API
      // dispatch
    }

    onCloseModal()
  }
  return (
    <>
      <div className='assignees-container'>
        {restMembers.length > 0 ? (
          <>
            <p className='mb-1'>
              Select member that will be assigned to task <span className='text-primary bolder'>{task.name}</span>
            </p>
            {restMembers.map(member => (
              <AssignmentMemberItem member={member} onSelect={handleSelectMembers} />
            ))}
          </>
        ) : (
          <p className='text-warning'>No member available!</p>
        )}
        {restMembers.length > 0 && (
          <Flex $alignItem='center' $justifyContent='end' className='mt-1'>
            <Button onClick={handleAssignMembers} variant='filled'>
              Assign
            </Button>
          </Flex>
        )}
      </div>
    </>
  )
}

export default AssignMember
