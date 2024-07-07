import Flex from '@comps/StyledComponents/Flex'
import PriorityTag from './PriorityTag'
import './TaskCard.scss'
import Button from '@comps/Button'
import DropdownMenu from '@comps/DropdownMenu'
import MenuItem from '@comps/MenuItem'
import { AssignmentResponse, TaskDetailForBoard, TaskResponseForBoard } from '@utils/types'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { createCardId } from '@utils/functions'
import { createContext, useEffect, useMemo, useState } from 'react'
import Modal from '@comps/Modal'
import HttpClient from '@utils/HttpClient'
import TaskDetail from './TaskDetail'
import { HttpStatusCode } from 'axios'
import { RemoteDraggingType } from '@pages/Project/partials/BoardContent'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import DuplicateTask from './TaskDetail/DuplicateTask'

const http = new HttpClient()

type TaskDetailModelState = {
  open: boolean
  taskDetail?: TaskDetailForBoard
}

type TaskDetailContextType = {
  state?: TaskDetailModelState
  setState?: React.Dispatch<React.SetStateAction<TaskDetailModelState>>
}

export const TaskDetailContext = createContext<TaskDetailContextType | undefined>(undefined)

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
  const [modalState, setModalState] = useState<TaskDetailModelState>({ open: false })
  const members = useSelector((state: RootState) => state.project.activeProject.members)
  const [dragSub, setDragSub] = useState<AssignmentResponse>()
  const [duplicateTaskModal, setDuplicateTaskModal] = useState(false)
  const taskAssignments = useMemo(() => {
    const tAssignments = members.filter(m => task?.taskAssignmentIds?.includes(m?.id))
    return tAssignments
  }, [members, task?.taskAssignmentIds])
  useEffect(() => {
    setDragSub(members.find(m => m.id === remoteDragging?.subId))
  }, [remoteDragging, members])

  const handleCloseTaskDetailModal = () => {
    setModalState({ ...modalState, open: false })
  }
  const handleLoadTaskDetail = async () => {
    const res = await http.getAuth(`/tasks/${task.id}/v/board`)
    if (res?.status === HttpStatusCode.Ok) {
      setModalState({ open: true, taskDetail: res.data }) // lưu chi tiết task vào state
    } else console.log('Fail: ', res?.message)
  }
  const handleToggleDuplicateTaskModal = () => {
    setDuplicateTaskModal(!duplicateTaskModal)
  }
  return (
    <>
      <TaskDetailContext.Provider value={{ state: modalState, setState: setModalState }}>
        <div
          onClick={handleLoadTaskDetail}
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
              <MenuItem className='text-danger'>
                <i className='fa-solid fa-trash-can'></i> Delete task
              </MenuItem>
              <MenuItem className='text-primary'>
                <i className='fa-solid fa-up-down-left-right'></i> Move
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
              {task?.dueDate ? (
                new Date(task.dueDate * 1000).toLocaleDateString()
              ) : (
                <span className='text-light'>Not set</span>
              )}
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
        <Modal
          style={{ width: '70%' }}
          layout={{
            header: {
              closeIcon: true,
              title: (
                <>
                  <Flex $alignItem='center' $gap='1rem'>
                    <Button onClick={handleToggleDuplicateTaskModal} variant='text' theme='default'>
                      <i className='fa-regular fa-clone'></i> Duplicate
                    </Button>
                    <Button variant='text' theme='default'>
                      <i className='fa-regular fa-trash-can'></i> Delete
                    </Button>
                    <Button variant='text' theme='default'>
                      <i className='fa-solid fa-right-to-bracket'></i> Join
                    </Button>
                    <Button variant='text' theme='default'>
                      <i className='fa-regular fa-envelope'></i> Invite member
                    </Button>
                    <Button variant='text' theme='default'>
                      <i className='fa-solid fa-thumbtack'></i> Need help!
                    </Button>
                  </Flex>
                </>
              )
            }
          }}
          open={modalState.open}
          onClose={handleCloseTaskDetailModal}
        >
          <TaskDetail />
        </Modal>
        <Modal
          layout={{ header: { title: 'Duplicate task', closeIcon: true } }}
          style={{ width: '30%' }}
          open={duplicateTaskModal}
          onClose={handleToggleDuplicateTaskModal}
        >
          <DuplicateTask task={task} onCloseModal={handleToggleDuplicateTaskModal} />
        </Modal>
      </TaskDetailContext.Provider>
    </>
  )
}

export default TaskCard
