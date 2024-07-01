import Flex from '@comps/StyledComponents/Flex'
import SubtaskMemberSelector from './SubtaskMemberSelector'
import { SubtaskForBoard } from '@utils/types'

type SubtaskItemProps = {
  subTask: SubtaskForBoard
  onCheckTask: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function SubtaskItem({ subTask, onCheckTask = () => {} }: SubtaskItemProps) {
  return (
    <>
      <Flex key={subTask?.id} $alignItem='center' $justifyContent='space-between' className='subtasks-item'>
        <Flex $alignItem='center' $gap='0.5rem' className='subtasks-item-title'>
          <input type='checkbox' name='subtaskStatus' onChange={onCheckTask} checked={subTask?.isCompleted} id={`subtaskStatus-${subTask?.id}`} />
          <label htmlFor={`subtaskStatus-${subTask?.id}`}>{subTask?.title}</label>
        </Flex>
        <Flex $alignItem='center' $gap='1.5rem'>
          {/* <span className='subtasks-item-icon'>
            <i className='fa-regular fa-clock'></i>
          </span> */}
          <SubtaskMemberSelector assignmentId={subTask.assignmentId} />
          <span className='subtasks-item-icon'>
            <i className='fa-regular fa-trash-can'></i>
          </span>
        </Flex>
      </Flex>
    </>
  )
}

export default SubtaskItem
