import { useLoaderData, useNavigate } from 'react-router-dom'
import './RecycleBin.scss'
import { AxiosResponse } from 'axios'
import { InTrashTaskResponse } from '@utils/types/task.type'
import DeletedTaskCard from './DeletedTaskCard'
import Flex from '@comps/StyledComponents'
import Button from '@comps/Button'
import { useState } from 'react'

function RecycleBin() {
  const response = useLoaderData() as AxiosResponse
  // const deletedTasks = response.data as InTrashTaskResponse[]
  const [deletedTasks, setDeletedTasks] = useState(response.data as InTrashTaskResponse[])
  const navigate = useNavigate()
  const handleBack = () => navigate(-1)
  const handleRemove = (taskId: string) => {
    setDeletedTasks(prev => {
      const newPrev = { ...prev }
      newPrev.splice(
        prev.findIndex(t => t.id === taskId),
        1
      )
      return newPrev
    })
  }
  return (
    <>
      <div className='recycle-bin flex-1'>
        <Flex $alignItem='center' $gap='1rem' className='mb-1'>
          <Button variant='text' theme='default' onClick={handleBack}>
            <i className='fa-solid fa-arrow-left'></i>
          </Button>
          <h2 className='text-primary bold'>
            <i className='fa-solid fa-trash-can'></i>&nbsp; Recycle Bin
          </h2>
        </Flex>
        <div className='deleted-tasks-container'>
          {deletedTasks?.map(item => {
            return <DeletedTaskCard onDelete={handleRemove} deletedTask={item} key={item.id} />
          })}
        </div>
      </div>
    </>
  )
}

export default RecycleBin
