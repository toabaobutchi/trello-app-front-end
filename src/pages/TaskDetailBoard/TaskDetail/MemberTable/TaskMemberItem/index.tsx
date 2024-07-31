import Button from '@comps/Button'
import Flex from '@comps/StyledComponents'
import { AssignmentResponse } from '@utils/types'

function TaskMemberItem({ taskMember, onUnassign }: { taskMember: AssignmentResponse, onUnassign: (id: string) => void }) {
  const handleUnassignTaskAssignment = () => {
    onUnassign(taskMember.id)
  }
  return (
    <>
      <div key={taskMember.id} className='member-info'>
        <Flex $alignItem='center' $gap='1rem'>
          <img src={taskMember.avatar} alt='avatar' />
          <div>
            <p className='member-info-title'>
              {taskMember?.email} ({taskMember.displayName})
            </p>
            <p className='member-info-role'>{taskMember.permission}</p>
          </div>
        </Flex>
        <Button theme='danger' onClick={handleUnassignTaskAssignment}>
          <i className='fa-regular fa-trash-can'></i>
        </Button>
      </div>
    </>
  )
}

export default TaskMemberItem
