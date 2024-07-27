import Button from '@comps/Button'
import Modal from '@comps/Modal'
import Flex from '@comps/StyledComponents'
import { projectSlice } from '@redux/ProjectSlice'
import { deleteTask } from '@services/task.services'
import { TaskResponseForBoard } from '@utils/types'
import { useDispatch } from 'react-redux'

type DeleteTaskMenuProps = {
  task: TaskResponseForBoard
  openModal: boolean
  onClose: () => void
}

function DeleteTaskMenu({ task, openModal, onClose }: DeleteTaskMenuProps) {
  const dispatch = useDispatch()
  const handleDeleteTask = async (moveToTrash: boolean = false) => {
    const res = await deleteTask(task.id, moveToTrash)
    if (res?.isSuccess) {
      const data = res.data
      dispatch(projectSlice.actions.deleteTask(data))
      onClose()
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