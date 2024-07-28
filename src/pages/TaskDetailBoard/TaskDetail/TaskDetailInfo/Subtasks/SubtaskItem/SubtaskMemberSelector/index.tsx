import Modal from '@comps/Modal'
import Tooltip from '@comps/Tooltip-v2'
import { useModal } from '@hooks/useModal'
import { RootState } from '@redux/store'
import { AssignByTaskResponse, AssignmentResponse, AssignSubtaskResponse, JoinSubtaskResponse } from '@utils/types'
import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SubtaskMemberSelectorMenu from './SubtaskMemberSelectorMenu'
import { assignSubtask, joinSubtask } from '@services/subtask.services'
import { TaskDetailContext } from '@pages/TaskDetailBoard/context'
import { hubs, ProjectHub } from '@utils/Hubs'
import { projectSlice } from '@redux/ProjectSlice'
import useMenu from '@hooks/useMenu'
import Menu from '@comps/Menu'
import Button from '@comps/Button'
import DropdownMenu from '@comps/DropdownMenu'

type SubtaskMemberSelectorProps = {
  assignmentId?: string
  subtaskId: number
}

function SubtaskMemberSelector({ assignmentId, subtaskId }: SubtaskMemberSelectorProps) {
  const projectMembers = useSelector((state: RootState) => state.project.activeProject.members)
  const [assignment, setAssignment] = useState<AssignmentResponse>()
  const [subtaskAssignmentModal, handleToggleSubtaskAssignmentModal] = useModal()
  const context = useContext(TaskDetailContext)
  const [projectHub] = useState(new ProjectHub())
  const dispatch = useDispatch()

  useEffect(() => {
    setAssignment(projectMembers.find(m => m.id === assignmentId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentId])

  const tooltipContent = !assignment
    ? 'No member has assigned this subtask yet!'
    : `${assignment?.email} (${assignment?.displayName})`

  const handleChangeSubtasksUI = (data: JoinSubtaskResponse | AssignSubtaskResponse) => {
    context?.setTask?.(prev => {
      const taskDetail = { ...prev } as typeof prev
      const joinedSubtask = taskDetail?.subTasks?.find(s => s.id === data.id)
      if (joinedSubtask) {
        joinedSubtask.assignmentId = data.assignmentId
        return taskDetail
      } else {
        return prev
      }
    })
  }

  // gọi api để thêm vào
  const handleSelectSubtaskAssignment = async (selectedAssignmentId: string) => {
    const res = await assignSubtask(subtaskId, selectedAssignmentId)
    if (res?.isSuccess) {
      const data = res.data

      if (data.isNewAssignment) {
        // thêm thành viên mới vào task - thay đổi context
        context?.setTask?.(prev => {
          const taskDetail = { ...prev } as typeof prev
          taskDetail?.taskAssignmentIds?.push(data.assignmentId)
          return taskDetail
        })

        // thay đổi store bên ngoài - dispatch
        const payload: AssignByTaskResponse = {
          assignerId: data.assignerId ?? '',
          assignmentIds: [data.assignmentId],
          taskId: data.taskId
        }
        dispatch(projectSlice.actions.addAssignmentToTask(payload))
      }
      handleChangeSubtasksUI(data)
      if (projectHub.isConnected) {
        projectHub.connection?.invoke(hubs.project.send.assignSubtask, data)
      }
    }
    handleToggleSubtaskAssignmentModal()
  }

  const handleJoinSubtask = async () => {
    const res = await joinSubtask(subtaskId)
    if (res?.isSuccess) {
      const data = res.data
      handleChangeSubtasksUI(data)

      // thong bao den hub
      if (projectHub.isConnected) {
        projectHub.connection?.invoke(hubs.project.send.joinSubtask, data)
      }
    }
    handleToggleSubtaskAssignmentModal()
  }
  const handleToggle = () => {
    if (!assignment) handleToggleSubtaskAssignmentModal()
  }
  return (
    <>
      <Tooltip arrow delay='0.25s' content={tooltipContent}>
        <div className='subtasks-item-icon' onClick={handleToggle}>
          {!assignment ? (
            <i className='fa-regular fa-user'></i>
          ) : (
            <>
              <DropdownMenu
                dir='ltr'
                title={{
                  content: <img className='subtasks-item-asignment-avatar cpointer' src={assignment?.avatar} />,
                  style: { padding: 0 }
                }}
                useArrow={false}
              >
                <Button variant='filled' theme='danger'>
                  <i className='fa-solid fa-user-minus'></i> Unassign
                </Button>
              </DropdownMenu>
            </>
          )}
        </div>
      </Tooltip>
      <Modal
        layout={{ header: { title: 'Assign/Join to subtask', closeIcon: true } }}
        style={{ width: '35%' }}
        open={subtaskAssignmentModal}
        onClose={handleToggleSubtaskAssignmentModal}
        className='subtask-assignment-modal'
      >
        <SubtaskMemberSelectorMenu onJoin={handleJoinSubtask} onSelect={handleSelectSubtaskAssignment} />
      </Modal>
    </>
  )
}

export default SubtaskMemberSelector
