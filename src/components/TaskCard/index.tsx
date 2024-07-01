import Flex from '@comps/StyledComponents/Flex'
import PriorityTag from './PriorityTag'
import './TaskCard.scss'
import Button from '@comps/Button'
import DropdownMenu from '@comps/DropdownMenu'
import MenuItem from '@comps/MenuItem'
import { TaskDetailForBoard, TaskResponseForBoard } from '@utils/types'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { createCardId } from '@utils/functions'
import { createContext, useState } from 'react'
import Modal from '@comps/Modal'
import HttpClient from '@utils/HttpClient'
import TaskDetail from './TaskDetail'
import { HttpStatusCode } from 'axios'

const http = new HttpClient()

type TaskDetailModelState = {
  open: boolean
  taskDetail?: TaskDetailForBoard
}

export const TaskDetailContext = createContext<TaskDetailForBoard | undefined>(undefined)

function TaskCard({ task }: { task: TaskResponseForBoard }) {
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
  // const [taskDetail, setTaskDetail] = useState<TaskDetailForBoard>()
  const handleCloseTaskDetailModal = () => {
    setModalState({ ...modalState, open: false })
  }
  // const handleToggleTaskDetailModal = () => {
  //   setModalState({ ...modalState, open: !modalState.open })
  // }
  const handleLoadTaskDetail = async () => {
    // setModalState(prev => ({ ...prev, open: true })) // mở modal ra trước
    const res = await http.getAuth(`/tasks/${task.id}/v/board`)
    if (res?.status === HttpStatusCode.Ok) {
      setModalState({ open: true, taskDetail: res.data }) // lưu chi tiết task vào state
    } else console.log('Fail: ', res?.message)
  }
  return (
    <>
      <TaskDetailContext.Provider value={modalState.taskDetail}>
        <div onClick={handleLoadTaskDetail} {...attributes} {...listeners} ref={setNodeRef} style={style} className='task-card'>
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
            <div className='task-card-footer-members'>
              <i className='fa-regular fa-user'></i> {task.assigneeCount}
            </div>
            {task.subTaskCount ? (
              <div className='task-card-body-subtasks'>
                <i className='fa-solid fa-list-check'></i> {task.completedSubTaskCount}/{task.subTaskCount}
              </div>
            ) : (
              <></>
            )}
            <div className='task-card-footer-due-date'>
              <i className='fa-regular fa-clock'></i> {task?.dueDate ? new Date(task.dueDate * 1000).toLocaleDateString() : <span className='text-light'>Not set</span>}
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
                    <Button variant='text' theme='default'>
                      <i className='fa-solid fa-link'></i> Copy
                    </Button>
                    <Button variant='text' theme='default'>
                      <i className='fa-regular fa-clone'></i> Duplicate
                    </Button>
                    <Button variant='text' theme='default'>
                      <i className='fa-regular fa-trash-can'></i> Delete
                    </Button>
                    <Button variant='text' theme='default'>
                      <i className='fa-solid fa-right-to-bracket'></i> Join
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
      </TaskDetailContext.Provider>
    </>
  )
}

export default TaskCard
