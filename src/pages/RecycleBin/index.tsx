import { useLoaderData, useNavigate } from 'react-router-dom'
import './RecycleBin.scss'
import { AxiosResponse } from 'axios'
import { InTrashTaskResponse } from '@utils/types'
import DeletedTaskCard from './DeletedTaskCard'
import Flex from '@comps/StyledComponents'
import Button from '@comps/Button'

function RecycleBin() {
  const response = useLoaderData() as AxiosResponse
  const deletedTasks = response.data as InTrashTaskResponse[]
  const navigate = useNavigate()
  const handleBack = () => navigate(-1)
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
            return <DeletedTaskCard deletedTask={item} key={item.id} />
          })}
        </div>
      </div>
    </>
  )
}

export default RecycleBin
