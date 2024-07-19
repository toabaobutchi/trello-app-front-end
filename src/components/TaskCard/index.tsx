import Flex from '@comps/StyledComponents/Flex'
import PriorityTag from './PriorityTag'
import './TaskCard.scss'
import Button from '@comps/Button'
import DropdownMenu from '@comps/DropdownMenu'
import MenuItem from '@comps/MenuItem'
import { AssignmentResponse, DeletedTaskResponse, TaskResponseForBoard } from '@utils/types'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { createCardId } from '@utils/functions'
import { useEffect, useMemo, useState } from 'react'
import HttpClient from '@utils/HttpClient'
import { HttpStatusCode } from 'axios'
import { RemoteDraggingType } from '@pages/Project/partials/BoardContent'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { projectSlice } from '@redux/ProjectSlice'
import { useLocation, useNavigate } from 'react-router-dom'

const http = new HttpClient()

const displayAvatarCount = 3

function TaskCard({ task, remoteDragging }: { task: TaskResponseForBoard; remoteDragging?: RemoteDraggingType }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: createCardId(task),
    data: { ...task, dragObject: 'Card' }
  })

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
      console.log(res.data)
      // dispatch(projectSlice.actions.joinTask(task))
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
            <MenuItem onClick={handleJoinTask}>
              <i className='fa-solid fa-right-to-bracket'></i> Join
            </MenuItem>
          </DropdownMenu>
        </Flex>
        <div className='task-card-body'>
          <div className='task-card-body-name'>{task.name}</div>
        </div>
        <Flex $alignItem='center' $justifyContent='space-between' className='task-card-footer'>
          <Flex $alignItem='center' $gap='1rem'>
            {task.subTaskCount ? (
              <div className='task-card-body-subtasks'>
                <i className="fa-regular fa-square-check"></i> {task.completedSubTaskCount}/{task.subTaskCount}
              </div>
            ) : (
              <></>
            )}
            <div className='task-card-body-comments'>
              <i className='fa-regular fa-message'></i> {task?.commentCount ?? 0}
            </div>
          </Flex>
          <div className='task-card-footer-due-date'>
            <i className='fa-regular fa-clock'></i>{' '}
            {task?.dueDate ? new Date(task.dueDate).toLocaleDateString() : <span className='text-light'>Not set</span>}
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
