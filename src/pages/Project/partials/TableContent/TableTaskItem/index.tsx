import PriorityTag from '@comps/TaskCard/PriorityTag'
import TaskCardTags from '@comps/TaskCard/TaskCardTags'
import { getDateString } from '@utils/functions'
import { TaskResponseForTable } from '@utils/types'
import { NavLink } from 'react-router-dom'
import TableTaskItemMenu from './TableTaskItemMenu'
import { useModal } from '@hooks/useModal'
import Modal from '@comps/Modal'
import Flex from '@comps/StyledComponents'
import Button from '@comps/Button'
import { useDispatch } from 'react-redux'
import { projectSlice } from '@redux/ProjectSlice'
import { joinTask } from '@services/task.services'
import { useEffect, useState } from 'react'
import { hubs, ProjectHub } from '@utils/Hubs'
import { useProjectSelector } from '@hooks/useProjectSelector'
import DeleteTaskMenu from '@comps/TaskCard/DeleteTaskMenu'

type TableTaskItemProps = {
  task: TaskResponseForTable
  isHighlight?: boolean
}

const NotSet = () => <span className='text-light'>[ Not set ]</span>

function TableTaskItem({ task, isHighlight = false }: TableTaskItemProps) {
  const [joinTaskModal, handleToggleJoinTaskModal] = useModal()
  const [deleteModal, handleToggleDeleteModal] = useModal()
  const dispatch = useDispatch()
  const { members, board } = useProjectSelector()
  const [projectHub] = useState(new ProjectHub())
  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => {
    if (task?.id) {
      const member = members.find(m => m.id === board?.assignmentId)
      if (!member) setIsJoined(false)
      else setIsJoined(task?.taskAssignmentIds?.includes(member.id) ?? false)
    }
  }, [task?.id, members, task?.taskAssignmentIds, board?.assignmentId])

  const handleJoinTask = async () => {
    if (task?.id) {
      const res = await joinTask(task?.id)
      if (res?.isSuccess) {
        handleToggleJoinTaskModal()
        const data = res.data
        dispatch(projectSlice.actions.joinTask(data))

        // call to hub
        if (projectHub.isConnected) {
          // SendJoinTask
          projectHub.connection?.send(hubs.project.send.joinTask, data)
        }
      }
    }
  }

  return (
    <>
      <tr className={`task-row__${isHighlight && task?.priority?.toLowerCase()}`}>
        <td>
          <input
            type='checkbox'
            className='table-option-checkbox'
            name={`table-check-${task?.id}`}
            id={`table-check-${task?.id}`}
            value={task?.id}
          />
        </td>
        <td className='table-task-name'>
          <NavLink to={`task/${task.id}`}>{task.name}</NavLink>
        </td>
        <td>{task.listName}</td>
        <td>{task.priority ? <PriorityTag priority={task.priority} /> : <NotSet />}</td>
        <td>{task.startedAt ? getDateString(new Date(task.startedAt)) : <NotSet />}</td>
        <td>{task.dueDate ? getDateString(new Date(task.dueDate)) : <NotSet />}</td>
        <td>
          {task?.completedSubTaskCount}/{task?.subTaskCount}
        </td>
        <td>{task?.taskAssignmentIds?.length}</td>
        <td>
          <TaskCardTags task={task} />
        </td>
        <td>
          <TableTaskItemMenu
            isJoined={isJoined}
            onDeleteTask={handleToggleDeleteModal}
            onJoinTask={handleToggleJoinTaskModal}
          />
        </td>
      </tr>
      {!isJoined && (
        <Modal
          style={{ width: '30%' }}
          layout={{
            header: {
              title: 'Join task',
              closeIcon: true
            },
            footer: (
              <>
                <Flex $alignItem='center' $gap='1rem'>
                  <Button onClick={handleToggleJoinTaskModal} variant='filled' theme='danger'>
                    Cancel
                  </Button>
                  <Button onClick={handleJoinTask} variant='filled' theme='primary'>
                    Join
                  </Button>
                </Flex>
              </>
            )
          }}
          open={joinTaskModal}
          onClose={handleToggleJoinTaskModal}
        >
          Join task <span className='text-primary fw-bold'>{task?.name}</span>
        </Modal>
      )}
      <DeleteTaskMenu task={task} openModal={deleteModal} onClose={handleToggleDeleteModal} />
    </>
  )
}

export default TableTaskItem
