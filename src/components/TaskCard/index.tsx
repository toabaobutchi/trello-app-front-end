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
import { useEffect, useState } from 'react'
import HttpClient from '@utils/HttpClient'
import { HttpStatusCode } from 'axios'
import { RemoteDraggingType } from '@pages/Project/partials/BoardContent'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { projectSlice } from '@redux/ProjectSlice'
import { useLocation, useNavigate } from 'react-router-dom'

const http = new HttpClient()

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
  // const [modalState, setModalState] = useState<TaskDetailModelState>({ open: false })
  const members = useSelector((state: RootState) => state.project.activeProject.members)
  const [dragSub, setDragSub] = useState<AssignmentResponse>()

  // const taskAssignments = useMemo(() => {
  //   const tAssignments = members.filter(m => task?.taskAssignmentIds?.includes(m?.id))
  //   return tAssignments
  // }, [members, task?.taskAssignmentIds])

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

  console.log('pathname >>> ', pathname)

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
            <MenuItem>
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
                <i className='fa-solid fa-list-check'></i> {task.completedSubTaskCount}/{task.subTaskCount}
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
          <div className='task-card-footer-members-more'>+3 more</div>
          <div className='task-card-footer-members-image-container'>
            <img
              src='https://play-lh.googleusercontent.com/hJGHtbYSQ0nCnoEsK6AGojonjELeAh_Huxg361mVrPmzdwm8Ots-JzEH5488IS2nojI'
              alt='avatar'
            />
          </div>
          <div className='task-card-footer-members-image-container'>
            <img
              src='https://makeover.imgix.net/data%2FWum4u3uPWFWmq0OOcldmZ7F1ZIx1%2Fstyles%2Fabc907637dcab5b86e04ee33fc9c79b2%2Fimages%2Fb877cb300f3aeb0ea0b1f13a44d39007?alt=media&token=c3783a66-4660-4819-98e2-f4c1e83e7752'
              alt='avatar'
            />
          </div>
          <div className='task-card-footer-members-image-container'>
            <img
              src='https://play-lh.googleusercontent.com/7Ak4Ye7wNUtheIvSKnVgGL_OIZWjGPZNV6TP_3XLxHC-sDHLSE45aDg41dFNmL5COA'
              alt='avatar'
            />
          </div>
          <div className='task-card-footer-members-image-container'>
            <img
              src='https://marketplace.canva.com/EAFltIh8PKg/1/0/1600w/canva-cute-anime-cartoon-illustration-girl-avatar-J7nVyTlhTAE.jpg'
              alt='avatar'
            />
          </div>
        </Flex>
      </div>
    </>
  )
}

export default TaskCard
