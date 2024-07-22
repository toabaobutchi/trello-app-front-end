import Flex from '@comps/StyledComponents/Flex'
import PriorityTag from './PriorityTag'
import './TaskCard.scss'
import Button from '@comps/Button'
import DropdownMenu from '@comps/DropdownMenu'
import MenuItem from '@comps/MenuItem'
import { AssignmentResponse, DeletedTaskResponse, JoinTaskResponse, TaskResponseForBoard } from '@utils/types'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { createCardId, DateCompareState, getDateString, isOverdue } from '@utils/functions'
import { useEffect, useMemo, useState } from 'react'
import HttpClient from '@utils/HttpClient'
import { HttpStatusCode } from 'axios'
import { RemoteDraggingType } from '@pages/Project/partials/BoardContent'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { projectSlice } from '@redux/ProjectSlice'
import { useLocation, useNavigate } from 'react-router-dom'
import { useProjectSelector } from '@hooks/useProjectSelector'

const http = new HttpClient()

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
    opacity: isDragging ? 0.5 : 1
  }
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const members = useSelector((state: RootState) => state.project.activeProject.members)
  const [dragSub, setDragSub] = useState<AssignmentResponse>()

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

  const handleDeleteTask = async () => {
    const res = await http.deleteAuth(`/tasks/${task.id}`)
    if (res?.status === HttpStatusCode.Ok) {
      const data = res?.data as DeletedTaskResponse
      dispatch(projectSlice.actions.deleteTask(data))
    }
  }

  const handleJoinTask = async () => {
    const res = await http.postAuth(`/tasks/${task?.id}/join`, {})
    if (res?.status === HttpStatusCode.Ok) {
      dispatch(projectSlice.actions.joinTask(res.data as JoinTaskResponse))
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
            <MenuItem onClick={handleDeleteTask} className='text-danger'>
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
        </Flex>
        <div className='task-card-body'>
          <div className={`task-card-body-name ${task.isCompleted ? 'task-card-body-name__completed' : ''}`}>
            {task.name}
          </div>
          <div className='task-card-body-tags row gap-1'>
            {isOverdue((task?.dueDate ?? 0) * 1000) === DateCompareState.DueSoon && (
              <p className='tag text-warning bg-warning'>
                <i className='fa-solid fa-hourglass-half'></i> Duesoon
              </p>
            )}
            {isOverdue((task?.dueDate ?? 0) * 1000) === DateCompareState.Overdue && (
              <p className='tag text-danger bg-danger'>
                <i className='fa-regular fa-calendar-xmark'></i> Overdue
              </p>
            )}
            {task?.isCompleted && (
              <p className='tag text-success bg-success'>
                <i className='fa-solid fa-check'></i> Completed
              </p>
            )}
            {task?.isMarkedNeedHelp && (
              <p className='tag text-purple bg-purple'>
                <i className='fa-regular fa-circle-question'></i> Need help
              </p>
            )}
          </div>
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
            {task?.dueDate ? getDateString(new Date(task.dueDate * 1000)) : <span className='text-light'>Not set</span>}
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
      </div>
    </>
  )
}

export default TaskCard
