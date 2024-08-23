import Button from '@comps/Button'
import Modal from '@comps/Modal'
import Flex from '@comps/StyledComponents'
import toast from '@comps/Toast/toast'
import useProjectDispatch from '@hooks/useProjectDispatch'
import useProjectHub from '@hooks/useProjectHub'
import { deleteTask } from '@services/task.services'
import { hubs } from '@utils/Hubs'
import { TaskResponseForBoard } from '@utils/types/task.type'

type DeleteTaskMenuProps = {
  task: TaskResponseForBoard
  openModal: boolean
  onClose: () => void
}

function DeleteTaskMenu({ task, openModal, onClose }: DeleteTaskMenuProps) {
  const { deleteTask: deleteTaskDispatch } = useProjectDispatch()
  const projectHub = useProjectHub()

  const handleDeleteTask = async (moveToTrash: boolean = false) => {
    const res = await deleteTask(task.id, moveToTrash)
    if (res?.isSuccess) {
      const data = res.data

      // dispatch man hinh chinh
      deleteTaskDispatch(data)

      // send to hub
      if (projectHub.isConnected) {
        projectHub.connection?.send(hubs.project.send.deleteTask, data, moveToTrash)
      }
      onClose()
    } else {
      toast.error('Failed to delete task', '')
    }
  }
  const handleDeletePermantly = async () => {
    await handleDeleteTask()
  }
  const handleDeleteMoveToTrash = async () => {
    await handleDeleteTask(true)
  }
  return (
    <>
      <Modal
        style={{ width: '30%' }}
        open={openModal}
        onClose={onClose}
        layout={{ header: { closeIcon: true, title: 'Delete task' } }}
      >
        <p style={{ fontSize: '1.1rem' }}>
          Are you sure you want to delete this task (<b className='text-danger'>{task.name}</b>)?
        </p>
        <p style={{ fontSize: '1.1rem' }} className='mt-1'>
          All references to (<b className='text-danger'>{task.name}</b>) will be removed!
        </p>
        <Flex $alignItem='center' $justifyContent='end' $gap='0.5rem' className='mt-2'>
          <Button variant='text' theme='danger' onClick={handleDeletePermantly}>
            <i className='fa-regular fa-trash-can'></i> Permantly delete
          </Button>
          <Button variant='text' theme='warning' onClick={handleDeleteMoveToTrash}>
            <i className='fa-solid fa-trash-can-arrow-up'></i> Move to trash
          </Button>
          <Button variant='text' theme='primary' onClick={onClose}>
            <i className='fa-solid fa-rotate-left'></i> Cancel
          </Button>
        </Flex>
      </Modal>
    </>
  )
}
export default DeleteTaskMenu
