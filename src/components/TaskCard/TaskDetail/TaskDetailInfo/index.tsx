import Flex from '@comps/StyledComponents/Flex'
import Subtasks from './Subtasks'
import { useContext, useEffect, useState } from 'react'
import { TaskDetailContext } from '@comps/TaskCard'
import { AssignmentResponse, SubtaskForBoard, UpdatedTaskResponse } from '@utils/types'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import UpdateTaskNameEditor from './UpdateTaskNameEditor'
import HttpClient from '@utils/HttpClient'
import { HttpStatusCode } from 'axios'
import UpdatePriorityEditor from './UpdatePriorityEditor'
import UpdateDueDateEditor from './UpdateDueDateEditor'
import UpdateDescriptionEditor from './UpdateDescriptionEditor'
import { useHub } from '@hooks/useHub'

const http = new HttpClient()

function TaskDetailInfo() {
  const task = useContext(TaskDetailContext)
  const taskDetail = task?.state?.taskDetail
  const project = useSelector((state: RootState) => state.project.activeProject)
  const account = useSelector((state: RootState) => state.login.accountInfo)
  const taskUpdateConnection = useHub('/dragHub', 'SendAddToDragGroup', project?.board?.id, account?.id)
  useEffect(() => {
    if (taskUpdateConnection) {
      taskUpdateConnection.on('ReceiveUpdateTaskInfo', (assignmentId: string, data: UpdatedTaskResponse) => {
        if (data && data.id === taskDetail?.id) {
          task?.setState?.(
            prev =>
              ({
                ...prev,
                taskDetail: {
                  ...taskDetail,
                  name: data?.name,
                  description: data?.description,
                  priority: data?.priority,
                  dueDate: data?.dueDate
                }
              } as typeof prev)
          )
        }
      })
    }
  }, [taskUpdateConnection])
  // lấy thông tin creator
  const [creator] = useState<AssignmentResponse | undefined>(() =>
    project?.members.find(p => p.id === taskDetail?.creatorId)
  )
  const handleSendMessageToDragHub = (data: UpdatedTaskResponse) => {
    if (taskUpdateConnection && project?.board?.id && data && account?.id) {
      taskUpdateConnection.invoke('SendUpdateTaskInfo', project?.board?.id, account?.id, data)
    }
  }
  const handleUpdateName = async (name: string) => {
    const res = await http.putAuth(`/tasks/${taskDetail?.id}`, { name })
    if (res?.status === HttpStatusCode.Ok) {
      const data = res?.data as UpdatedTaskResponse
      task?.setState?.(prev => ({ ...prev, taskDetail: { ...taskDetail, name: data?.name } } as typeof prev))
      handleSendMessageToDragHub(data)
      // if (taskUpdateConnection && project?.board?.id && data && account?.id) {
      //   taskUpdateConnection.invoke('SendUpdateTaskInfo', project?.board?.id, account?.id, data)
      // }
    }
  }
  const handleUpdatePriority = async (priority: string) => {
    const res = await http.putAuth(`/tasks/${taskDetail?.id}`, { priority })
    if (res?.status === HttpStatusCode.Ok) {
      const data = res?.data as UpdatedTaskResponse
      task?.setState?.(prev => ({ ...prev, taskDetail: { ...taskDetail, priority: data?.priority } } as typeof prev))
      handleSendMessageToDragHub(data)
    }
  }
  const handleUpdateDueDate = async (dueDate: Date) => {
    const res = await http.putAuth(`/tasks/${taskDetail?.id}`, { dueDate: dueDate.getTime() / 1000 })
    if (res?.status === HttpStatusCode.Ok) {
      if (res?.status === HttpStatusCode.ResetContent) {
        console.log('Task due date is larger than project due date')
      } else {
        const data = res?.data as UpdatedTaskResponse
        task?.setState?.(prev => ({ ...prev, taskDetail: { ...taskDetail, dueDate: data?.dueDate } } as typeof prev))
        handleSendMessageToDragHub(data)
      }
    }
  }
  const handleUpdateDescription = async (description: string) => {
    const res = await http.putAuth(`/tasks/${taskDetail?.id}`, { description })
    if (res?.status === HttpStatusCode.Ok) {
      const data = res?.data as UpdatedTaskResponse
      task?.setState?.(
        prev => ({ ...prev, taskDetail: { ...taskDetail, description: res?.data?.description } } as typeof prev)
      )
      handleSendMessageToDragHub(data)
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
