import Button from '@comps/Button'
import Flex from '@comps/StyledComponents/Flex'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { TaskDetailForBoard } from '@utils/types'
import { useMemo } from 'react'
import './AssignMember.scss'

type AssignMemberProps = {
  task: TaskDetailForBoard
  onCloseModal?: () => void
}

function AssignMember({ task, onCloseModal = () => {} }: AssignMemberProps) {
  const { members } = useProjectSelector()
  const restMembers = useMemo(() => {
    return members.filter(m => !task.taskAssignmentIds?.includes(m.id))
  }, [members, task.taskAssignmentIds])
  return (
    <>
      <div className='assignees-container'>
        {restMembers.length > 0 ? (
          <>
            {restMembers.map(member => (
              <div key={member.id} className='assignee-item'>
                <Flex $alignItem='center' $justifyContent='space-between' $gap='1rem'>
                  <Flex $alignItem='center' $gap='0.25rem'>
                    <img src={member.avatar} alt='avatar' />
                    <div className='assignee-item-info'>
                      <p className='assignee-item-info-name'>{member.displayName}</p>
                      <p className='assignee-item-info-email'>{member.email}</p>
                    </div>
                  </Flex>
                  <Button>
                    <i className='fa-solid fa-user-tag'></i> Assign
                  </Button>
                </Flex>
              </div>
            ))}
          </>
        ) : (
          <p className='text-warning'>No member available!</p>
        )}
      </div>
    </>
  )
}

export default AssignMember
