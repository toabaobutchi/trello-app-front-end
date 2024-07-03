import Flex from '@comps/StyledComponents/Flex'
import PriorityTag from '@comps/TaskCard/PriorityTag'
import TextArea from '@comps/TextArea'
import Subtasks from './Subtasks'
import { useContext, useState } from 'react'
import { TaskDetailContext } from '@comps/TaskCard'
import { AssignmentResponse, SubtaskForBoard } from '@utils/types'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'

function TaskDetailInfo() {
  const taskDetail = useContext(TaskDetailContext)?.taskDetail
  const projectMembers = useSelector((state: RootState) => state.project.activeProject.members)

  // lấy thông tin creator
  const [creator] = useState<AssignmentResponse | undefined>(() => projectMembers.find(p => p.id === taskDetail?.creatorId))

  return (
    <>
      <div className='task-details-basic-info'>
        <h2 className='task-details-name'>{taskDetail?.name}</h2>
        <Flex $alignItem='center' $gap='1.5rem' className='task-details-basic-info-item'>
          <p>
            <i className='fa-solid fa-user-pen'></i> Created by:
          </p>
          <Flex $alignItem='center' $gap='0.25rem' className='task-details-basic-info-item-creator'>
            <img className='task-details-creator-avatar' src={creator?.avatar} />{' '}
            <span style={{ fontSize: '1rem' }}>
              {creator?.email} ({creator?.displayName})
            </span>
          </Flex>
        </Flex>
        <Flex $alignItem='center' $gap='1.5rem' className='task-details-basic-info-item'>
          <p>
            <i className='fa-solid fa-table-columns'></i> Status (List):
          </p>
          <p>{taskDetail?.listName}</p>
        </Flex>
        <Flex $alignItem='center' $gap='1.5rem' className='task-details-basic-info-item'>
          <p>
            <i className='fa-solid fa-tag'></i> Priority:
          </p>
          <PriorityTag priority={taskDetail?.priority} />
        </Flex>
        <Flex $alignItem='center' $gap='1.5rem' className='task-details-basic-info-item'>
          <p>
            <i className='fa-regular fa-clock'></i> Due date:
          </p>
          <p>{taskDetail?.dueDate ?? <span className='text-light'>[Not set]</span>}</p>
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
            value={taskDetail?.description}
          />
        </div>
        <Subtasks subtasks={taskDetail?.subTasks as SubtaskForBoard[]} taskId={taskDetail?.id ?? ""} />
      </div>
    </>
  )
}

export default TaskDetailInfo
