import Flex from '@comps/StyledComponents/Flex'
import PriorityTag from './PriorityTag'
import './TaskCard.scss'
import Button from '@comps/Button'
import DropdownMenu from '@comps/DropdownMenu'
import MenuItem from '@comps/MenuItem'
import { AssignmentResponse, TaskResponseForBoard } from '@utils/types'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { createCardId, DateCompareState, getDateString, isInToday, isOverdue } from '@utils/functions'
import { useEffect, useMemo, useState } from 'react'
import { RemoteDraggingType } from '@pages/Project/partials/BoardContent'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { projectSlice } from '@redux/ProjectSlice'
import { useLocation, useNavigate } from 'react-router-dom'
import { useProjectSelector } from '@hooks/useProjectSelector'
import DeleteTaskMenu from './DeleteTaskMenu'
import { useModal } from '@hooks/useModal'
import { joinTask } from '@services/task.services'
import TaskCardTags from './TaskCardTags'
import TaskDependencies from './TaskDependencies'

const displayAvatarCount = 3

function TaskCard({ task, remoteDragging }: { task: TaskResponseForBoard; remoteDragging?: RemoteDraggingType }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: createCardId(task),
    data: { ...task, dragObject: 'Card' }
  })
  const { board } = useProjectSelector()

  const isJoined = useMemo(
    () => task.taskAssignmentIds?.includes(board.assignmentId),
    [task.id, task.taskAssignmentIds, board.assignmentId]
  )
  const style = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    border: isDragging ? '1px solid #4B70F5' : 'unset'
  }
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { members } = useProjectSelector()
  const [dragSub, setDragSub] = useState<AssignmentResponse>()
  const [confirmDeleteModal, handleToggleConfirmDeleteModal] = useModal()
  const taskAssignments = useMemo(() => {
    const tAssignments = members.filter(m => task?.taskAssignmentIds?.includes(m?.id))
    return tAssignments
  }, [members, task?.taskAssignmentIds])

  useEffect(() => {
    setDragSub(members.find(m => m.id === remoteDragging?.subId))
  }, [remoteDragging, members])

  const handleNavigateToTaskDetail = () => {
    navigate(`${pathname}/task/${task?.id}`)
  }

  // const handleDeleteTask = async () => {
  //   const res = await http.deleteAuth(`/tasks/${task.id}`)
  //   if (res?.status === HttpStatusCode.Ok) {
  //     const data = res?.data as DeletedTaskResponse
  //     dispatch(projectSlice.actions.deleteTask(data))
  //   }
  // }

  const handleJoinTask = async () => {
    const res = await joinTask(task.id)
    if (res?.isSuccess) {
      dispatch(projectSlice.actions.joinTask(res.data))
    }
  }
  return (
    <>
      <div
        onClick={handleNavigateToTaskDetail}
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        style={style}
        drag-subject={`${dragSub?.email} is dragging this`}
        className={`task-card ${
          remoteDragging?.dragObject === 'Card' &&
          remoteDragging?.isDragging &&
          remoteDragging?.dragObjectId === task.id
            ? 'remote-dragging-object'
            : ''
        } ${task?.priority ? task?.priority?.toLowerCase() : 'default'}-task-card`}
      >
        <Flex $alignItem='center' $justifyContent='space-between' className='task-card-header'>
          <PriorityTag priority={task.priority} />
          <DropdownMenu
            useArrow={false}
            dir='rtl'
            showOn='click'
            style={{ width: '150px' }}
            title={{
              content: (
                <Button variant='text' theme='default'>
                  <i className='fa-solid fa-ellipsis-vertical'></i>
                </Button>
              ),
              style: {
                padding: 0,
                borderRadius: 0
              }
            }}
          >
            <MenuItem onClick={handleToggleConfirmDeleteModal} className='text-danger'>
              <i className='fa-solid fa-trash-can'></i> Delete task
            </MenuItem>
            <MenuItem className='text-primary'>
              <i className='fa-solid fa-up-down-left-right'></i> Move
            </MenuItem>
            {!isJoined && (
              <MenuItem onClick={handleJoinTask}>
                <i className='fa-solid fa-right-to-bracket'></i> Join
              </MenuItem>
            )}
          </DropdownMenu>
          <DeleteTaskMenu task={task} openModal={confirmDeleteModal} onClose={handleToggleConfirmDeleteModal} />
        </Flex>
        <div className='task-card-body'>
          <div className={`task-card-body-name ${task.isCompleted ? 'task-card-body-name__completed' : ''}`}>
            {task.name}
          </div>
          <TaskCardTags task={task} />
        </div>
        <Flex $alignItem='center' $justifyContent='space-between' className='task-card-footer'>
          <Flex $alignItem='center' $gap='1rem'>
            {task.subTaskCount ? (
              <div className='task-card-body-subtasks'>
                <i className='fa-regular fa-square-check'></i> {task.completedSubTaskCount}/{task.subTaskCount}
              </div>
            ) : (
              <></>
            )}
            <div className='task-card-body-comments'>
              <i className='fa-regular fa-message'></i> {task?.commentCount ?? 0}
            </div>
          </Flex>
          <div
            className={`task-card-footer-due-date ${
              isOverdue((task?.dueDate ?? 0) * 1000) === DateCompareState.DueSoon
                ? 'text-warning bold'
                : isOverdue((task?.dueDate ?? 0) * 1000) === DateCompareState.Overdue
                ? 'text-danger bold'
                : ''
            }`}
          >
            <i className='fa-regular fa-clock'></i>{' '}
            {task?.dueDate ? getDateString(new Date(task.dueDate)) : <span className='text-light'>Not set</span>}
          </div>
        </Flex>
        <Flex
          $alignItem='center'
          $justifyContent='start'
          $flexDirection='row-reverse'
          className='posr task-card-footer-members'
        >
          {taskAssignments.length - displayAvatarCount > 0 && (
            <div className='task-card-footer-members-more'>+{taskAssignments.length - displayAvatarCount} more</div>
          )}
          {taskAssignments.slice(0, displayAvatarCount).map(member => (
            <div key={member.id} className='task-card-footer-members-image-container'>
              <img src={member.avatar} alt='avatar' />
            </div>
          ))}
        </Flex>
        {task.dependencyIds && task.dependencyIds.length > 0 && <TaskDependencies dependencyIds={task.dependencyIds} />}
      </div>
    </>
  )
}

export default TaskCard
