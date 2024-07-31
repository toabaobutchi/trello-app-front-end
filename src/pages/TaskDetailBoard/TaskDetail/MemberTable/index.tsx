import Button from '@comps/Button'
import './MemberTable.scss'
import Flex from '@comps/StyledComponents/Flex'
import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { TaskDetailContext } from '@pages/TaskDetailBoard/context'
import { AssignmentResponse } from '@utils/types'
import { unassignTaskAssignment } from '@services/assignment.services'
import TaskMemberItem from './TaskMemberItem'
import { projectSlice } from '@redux/ProjectSlice'
import { hubs, ProjectHub } from '@utils/Hubs'

function MemberTable() {
  const context = useContext(TaskDetailContext)
  const taskDetail = context?.task
  const projectMembers = useSelector((state: RootState) => state.project.activeProject.members)
  const dispatch = useDispatch()
  const [projectHub] = useState(new ProjectHub())

  // su dung useEffect de thay doi
  const [taskMembers, setTaskMembers] = useState<AssignmentResponse[]>([])
  useEffect(() => {
    setTaskMembers(projectMembers.filter(m => taskDetail?.taskAssignmentIds?.includes(m.id)))
  }, [taskDetail?.taskAssignmentIds, projectMembers])

  const handleUnassign = async (assignmentId: string) => {
    if (taskDetail?.id) {
      const res = await unassignTaskAssignment(taskDetail?.id, { assignmentId })
      if (res?.isSuccess) {
        // cập nhật lại context của bảng task
        const data = res.data
        context?.setTask?.(
          prev =>
            ({
              ...prev,
              taskAssignmentIds: prev?.taskAssignmentIds?.filter(tmId => tmId !== data.taskId)
            } as typeof prev)
        )

        // dispatch
        dispatch(projectSlice.actions.removeTaskAssignment(data))

        // call to hub
        if (projectHub.isConnected) {
          projectHub.connection?.invoke(hubs.project.send.unassignTaskAssignment, data)
        }
      }
    }
  }

  return (
    <>
      <p className='mb-1 text-primary'>Task member</p>
      <Flex
        $alignItem='center'
        $flexDirection='column'
        $gap='0.5rem'
        style={{ marginTop: '0.5rem', padding: '0 0.25rem' }}
      >
        {taskMembers?.map(tm => {
          return <TaskMemberItem taskMember={tm} onUnassign={handleUnassign} />
        })}
      </Flex>
    </>
  )
}

export default MemberTable
