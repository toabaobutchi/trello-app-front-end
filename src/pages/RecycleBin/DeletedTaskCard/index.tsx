import Flex from '@comps/StyledComponents'
import { CreateTaskResponse, InTrashTaskResponse, ProjectPageParams } from '@utils/types'
import './DeletedTaskCard.scss'
import { getDateString } from '@utils/functions'
import Button from '@comps/Button'
import { useNavigate, useParams } from 'react-router-dom'
import { linkCreator } from '@routes/router'
import { deleteTask, restoreTask } from '@services/task.services'
import toast from '@comps/Toast/toast'
import { useDispatch } from 'react-redux'
import { projectSlice } from '@redux/ProjectSlice'

function DeletedTaskCard({
  deletedTask,
  onDelete
}: {
  deletedTask: InTrashTaskResponse
  onDelete: (taskId: string) => void
}) {
  const navigate = useNavigate()
  const params = useParams() as ProjectPageParams
  const handleNavigateToMemberDetail = () => {
    navigate(linkCreator.projectMember(params, deletedTask.deleter?.id))
  }
  const dispatch = useDispatch()
  const handleDelete = async () => {
    const res = await deleteTask(deletedTask.id)
    if (res?.isSuccess) {
      const data = res.data
      onDelete(data.id)
      // navigate(linkCreator.projectRecycleBin(params))
    } else {
      // Handle error
      toast.error('Cannot delete task', '')
    }
  }
  const handleRestore = async () => {
    const res = await restoreTask(deletedTask.id)
    if (res?.isSuccess) {
      const data = res.data
      // const model: CreateTaskResponse = {

      // }
      // dispatch(projectSlice.actions.addNewTask(data))
      // navigate(linkCreator.projectRecycleBin(params))
      onDelete(data.id)
    } else {
      // Handle error
      toast.error('Cannot store task', '')
    }
  }
  return (
    <>
      <div className='in-trash-task-card'>
        <p className='in-trash-task-card-title'>{deletedTask.name}</p>
        <p className='in-trash-task-card-description'>{deletedTask.description}</p>
        <p className='in-trash-task-card-delete-date'>Deleted at: {getDateString(new Date(deletedTask.deletedAt))}</p>
        <p className='text-secondary mt-1 bold'>Deleted by</p>
        <Flex $alignItem='center' $gap='0.5rem' className='in-trash-task-card-deleter'>
          <img className='in-trash-task-card-deleter-avatar' src={deletedTask.deleter?.avatar} alt='avatar' />
          <div onClick={handleNavigateToMemberDetail} className='cpointer'>
            <p className='in-trash-task-card-deleter-name'>{deletedTask.deleter?.name}</p>
            <p className='in-trash-task-card-deleter-email'>{deletedTask.deleter?.email}</p>
          </div>
        </Flex>
        <Flex $alignItem='center' $gap='0.5rem' $justifyContent='end' className='mt-1'>
          <Button onClick={handleDelete} variant='filled' theme='danger'>
            <i className='fa-regular fa-trash-can'></i> Delete
          </Button>
          <Button onClick={handleRestore} variant='filled' theme='primary'>
            <i className='fa-regular fa-window-restore'></i> Restore
          </Button>
        </Flex>
      </div>
    </>
  )
}

export default DeletedTaskCard
