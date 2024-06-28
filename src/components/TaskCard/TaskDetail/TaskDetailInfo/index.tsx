import Flex from '@comps/StyledComponents/Flex'
import PriorityTag from '@comps/TaskCard/PriorityTag'
import TextArea from '@comps/TextArea'
import Subtasks from './Subtasks'

function TaskDetailInfo() {
  return (
    <>
      <div className='task-details-basic-info'>
        <h2 className='task-details-name'>Project name</h2>
        <Flex $alignItem='center' $gap='1.5rem' className='task-details-basic-info-item'>
          <p>
            <i className='fa-solid fa-user-pen'></i> Created by:
          </p>
          <Flex $alignItem='center' $gap='0.25rem'>
            <img className='task-details-creator-avatar' src='https://cdn.pixabay.com/photo/2021/02/27/16/25/woman-6055084_1280.jpg' /> <span>ngohoaian13010@gmail.com (Hoài An)</span>
          </Flex>
        </Flex>
        <Flex $alignItem='center' $gap='1.5rem' className='task-details-basic-info-item'>
          <p>
            <i className='fa-solid fa-table-columns'></i> Status (List):
          </p>
          <p>To do</p>
        </Flex>
        <Flex $alignItem='center' $gap='1.5rem' className='task-details-basic-info-item'>
          <p>
            <i className='fa-solid fa-tag'></i> Priority:
          </p>
          <PriorityTag priority='High' />
        </Flex>
        <Flex $alignItem='center' $gap='1.5rem' className='task-details-basic-info-item'>
          <p>
            <i className='fa-regular fa-clock'></i> Due date:
          </p>
          <p>[Not set]</p>
        </Flex>
        <div className='task-details-basic-info-item'>
          <TextArea
            id='task-details-description'
            label={
              <>
                <i className='fa-solid fa-scroll'></i> Description
              </>
            }
            rows={5}
          />
        </div>
        <Subtasks />
      </div>
    </>
  )
}

export default TaskDetailInfo
