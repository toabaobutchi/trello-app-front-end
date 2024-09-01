import Button from '@comps/Button'
import Modal from '@comps/Modal'
import Flex from '@comps/StyledComponents'
import SwitchButton from '@comps/SwitchButton'
import { useModal } from '@hooks/useModal'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { isAdminOrOwner } from '@utils/functions'
import { TaskDetailForBoard } from '@utils/types/task.type'
import { useEffect, useState } from 'react'
import AssignMember from './AssignMember'
import DuplicateTask from './DuplicateTask'
type TaskDetailHeaderToolBarProps = {
  taskDetail?: TaskDetailForBoard
  onMarkNeedHelp: (e: React.ChangeEvent<HTMLInputElement>) => void
  onMarkCompleteTask: () => void
  onReOpenTask: () => void
  onJoinTask: () => void
}
function TaskDetailHeaderToolBar({
  taskDetail,
  onMarkNeedHelp,
  onMarkCompleteTask,
  onReOpenTask,
  onJoinTask
}: TaskDetailHeaderToolBarProps) {
  const [duplicateTaskModal, handleToggleDuplicateTaskModal] = useModal()
  const [joinModal, handleToggleJoinModal] = useModal()
  const [assignModal, handleToggleAssignModal] = useModal()
  const { members, board } = useProjectSelector()
  const isAdminorOwner = isAdminOrOwner(board.context)
  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => {
    if (taskDetail?.id) {
      const member = members.find(m => m.id === board?.assignmentId)
      if (!member) setIsJoined(false)
      else setIsJoined(taskDetail?.taskAssignmentIds?.includes(member.id) ?? false)
    }
  }, [taskDetail?.id, members, taskDetail?.taskAssignmentIds, board?.assignmentId])

  const handleJoinTask = () => {
    handleToggleJoinModal()
    onJoinTask()
  }

  return (
    <>
      <Flex $alignItem='center' $gap='1rem'>
        {isAdminorOwner && (
          <Button onClick={handleToggleDuplicateTaskModal} variant='text' theme='default'>
            <i className='fa-regular fa-clone'></i> Duplicate
          </Button>
        )}
        {!isJoined && (
          <Button onClick={handleToggleJoinModal} variant='text' theme='default'>
            <i className='fa-solid fa-right-to-bracket'></i> Join
          </Button>
        )}
        {isAdminorOwner && (
          <Button onClick={handleToggleAssignModal} variant='text' theme='default'>
            <i className='fa-solid fa-user-plus'></i> Assign
          </Button>
        )}
        {taskDetail?.id && (
          <Flex $alignItem='center' $gap='0.5rem'>
            <SwitchButton
              inputAttributes={{
                id: 'need-help-toggle',
                type: 'checkbox',
                name: 'need-help-toggle',
                checked: Boolean(taskDetail?.isMarkedNeedHelp)
              }}
              onChange={onMarkNeedHelp}
            />
            <label
              className={taskDetail?.isMarkedNeedHelp ? 'text-success' : 'text-secondary'}
              style={{ fontSize: '1rem' }}
              htmlFor='need-help-toggle'
            >
              Need help!
            </label>
          </Flex>
        )}
        {!taskDetail?.isCompleted ? (
          <Button onClick={onMarkCompleteTask} variant='text' theme='default'>
            <i className='fa-solid fa-check'></i> Mark as completed
          </Button>
        ) : (
          <>
            <Button variant='text' theme='success'>
              Completed <i className='fa-solid fa-check'></i>
            </Button>
          </>
        )}
        {taskDetail?.isCompleted && isAdminorOwner && (
          <>
            <Button onClick={onReOpenTask} variant='text' theme='warning'>
              <i className='fa-solid fa-arrow-rotate-left'></i> Re-open
            </Button>
          </>
        )}
      </Flex>
      {/* duplicate modal */}
      <Modal
        layout={{ header: { title: 'Duplicate task', closeIcon: true } }}
        className='modal-w-30'
        open={duplicateTaskModal}
        onClose={handleToggleDuplicateTaskModal}
      >
        <DuplicateTask task={taskDetail} onCloseModal={handleToggleDuplicateTaskModal} />
      </Modal>

      {/* join modal */}
      <Modal
        className='modal-w-30'
        layout={{
          header: {
            title: 'Join task',
            closeIcon: true
          },
          footer: (
            <>
              <Flex $alignItem='center' $gap='1rem'>
                <Button onClick={handleToggleJoinModal} variant='filled' theme='danger'>
                  Cancel
                </Button>
                <Button onClick={handleJoinTask} variant='filled' theme='primary'>
                  Join
                </Button>
              </Flex>
            </>
          )
        }}
        open={joinModal}
        onClose={handleToggleJoinModal}
      >
        Join task <span className='text-primary fw-bold'>{taskDetail?.name}</span>
      </Modal>

      {/* assign modal */}
      <Modal
        open={assignModal}
        layout={{ header: { closeIcon: true, title: 'Assign to new members' } }}
        onClose={handleToggleAssignModal}
        className='modal-w-30'
      >
        {taskDetail && <AssignMember task={taskDetail} onCloseModal={handleToggleAssignModal} />}
      </Modal>
    </>
  )
}

export default TaskDetailHeaderToolBar
