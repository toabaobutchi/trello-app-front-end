import Flex from '@comps/StyledComponents/Flex'
import PriorityTag from '@comps/TaskCard/PriorityTag'
import TextArea from '@comps/TextArea'
import Subtasks from './Subtasks'
import { useContext, useState } from 'react'
import { TaskDetailContext } from '@comps/TaskCard'
import { AssignmentResponse, SubtaskForBoard } from '@utils/types'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import UpdateTaskNameEditor from './UpdateTaskNameEditor'
import HttpClient from '@utils/HttpClient'
import { HttpStatusCode } from 'axios'
import UpdatePriorityEditor from './UpdatePriorityEditor'
import UpdateDueDateEditor from './UpdateDueDateEditor'
import UpdateDescriptionEditor from './UpdateDescriptionEditor'

const http = new HttpClient()

function TaskDetailInfo() {
  const task = useContext(TaskDetailContext)
  const taskDetail = task?.state?.taskDetail
  const projectMembers = useSelector((state: RootState) => state.project.activeProject.members)

  // lấy thông tin creator
  const [creator] = useState<AssignmentResponse | undefined>(() =>
    projectMembers.find(p => p.id === taskDetail?.creatorId)
  )
  const handleUpdateName = async (name: string) => {
    const res = await http.putAuth(`/tasks/${taskDetail?.id}`, { name })
    if (res?.status === HttpStatusCode.Ok) {
      task?.setState?.(prev => ({ ...prev, taskDetail: { ...taskDetail, name: res?.data?.name } } as typeof prev))
    }
  }
  const handleUpdatePriority = async (priority: string) => {
    const res = await http.putAuth(`/tasks/${taskDetail?.id}`, { priority })
    if (res?.status === HttpStatusCode.Ok) {
      task?.setState?.(
        prev => ({ ...prev, taskDetail: { ...taskDetail, priority: res?.data?.priority } } as typeof prev)
      )
    }
  }
  const handleUpdateDueDate = async (dueDate: Date) => {
    const res = await http.putAuth(`/tasks/${taskDetail?.id}`, { dueDate: dueDate.getTime() / 1000 })
    if (res?.status === HttpStatusCode.Ok) {
      task?.setState?.(prev => ({ ...prev, taskDetail: { ...taskDetail, dueDate: res?.data?.dueDate } } as typeof prev))
    }
  }
  const handleUpdateDescription = async (description: string) => {
    const res = await http.putAuth(`/tasks/${taskDetail?.id}`, { description })
    if (res?.status === HttpStatusCode.Ok) {
      task?.setState?.(
        prev => ({ ...prev, taskDetail: { ...taskDetail, description: res?.data?.description } } as typeof prev)
      )
    }
  }
  return (
    <>
      <div className='task-details-basic-info'>
        <UpdateTaskNameEditor taskName={taskDetail?.name} onUpdateTaskName={handleUpdateName} />
        <Flex $alignItem='center' $gap='1.5rem' className='task-details-basic-info-item'>
          <p className='bold'>
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
          <p className='bold'>
            <i className='fa-solid fa-table-columns'></i> Status (List):
          </p>
          <p>{taskDetail?.listName}</p>
        </Flex>
        <Flex $alignItem='center' $gap='1.5rem' className='task-details-basic-info-item'>
          <p className='bold'>
            <i className='fa-solid fa-tag'></i> Priority:
          </p>
          {/* <PriorityTag priority={taskDetail?.priority} /> */}
          <UpdatePriorityEditor onUpdate={handleUpdatePriority} priority={taskDetail?.priority} />
        </Flex>
        <Flex $alignItem='center' $gap='1.5rem' className='task-details-basic-info-item'>
          <p className='bold'>
            <i className='fa-regular fa-clock'></i> Due date:
          </p>
          {/* <p>{taskDetail?.dueDate ?? <span className='text-light'>[Not set]</span>}</p>
           */}
          <UpdateDueDateEditor dueDate={taskDetail?.dueDate} onUpdate={handleUpdateDueDate} />
        </Flex>
        <Flex $alignItem='center' $gap='1.5rem' className='task-details-basic-info-item'>
          <p className='bold'>
            <i className='fa-solid fa-scroll'></i> Description
          </p>
          <UpdateDescriptionEditor description={taskDetail?.description} onUpdate={handleUpdateDescription} />
        </Flex>
        <Subtasks subtasks={taskDetail?.subTasks as SubtaskForBoard[]} taskId={taskDetail?.id ?? ''} />
      </div>
    </>
  )
}

export default TaskDetailInfo
