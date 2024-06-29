import Flex from '@comps/StyledComponents/Flex'
import { SubtaskType } from '..'
import SubtaskMemberSelector from './SubtaskMemberSelector'

type SubtaskItemProps = {
  subTask: SubtaskType
  onCheckTask: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function SubtaskItem({ subTask, onCheckTask = () => {} }: SubtaskItemProps) {
  return (
    <>
      <Flex key={subTask?.id} $alignItem='center' $justifyContent='space-between' className='subtasks-item'>
        <Flex $alignItem='center' $gap='0.5rem' className='subtasks-item-title'>
          <input type='checkbox' name='subtaskStatus' onChange={onCheckTask} checked={subTask?.status} id={`subtaskStatus-${subTask?.id}`} />
          <label htmlFor={`subtaskStatus-${subTask?.id}`}>{subTask?.title}</label>
        </Flex>
        <Flex $alignItem='center' $gap='1.5rem'>
          <span className='subtasks-item-icon'>
            <i className='fa-regular fa-clock'></i>
          </span>
          {/* <span className='subtasks-item-icon'>
            <i className='fa-regular fa-user'></i>
          </span> */}
          <SubtaskMemberSelector />
          <span className='subtasks-item-icon'>
            <i className='fa-regular fa-trash-can'></i>
          </span>
        </Flex>
      </Flex>
    </>
  )
}

export default SubtaskItem
