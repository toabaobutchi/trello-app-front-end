import { useLoaderData } from 'react-router-dom'
import './RecycleBin.scss'
import { AxiosResponse } from 'axios'
import { InTrashTaskResponse } from '@utils/types'
import DeletedTaskCard from './DeletedTaskCard'
import Flex from '@comps/StyledComponents'
import Button from '@comps/Button'

function RecycleBin() {
  const response = useLoaderData() as AxiosResponse
  const deletedTasks = response.data as InTrashTaskResponse[]
  return (
    <>
      <div className='recycle-bin'>
        <Flex $alignItem='center' $gap='1rem'>
          <Button variant='text' theme='default'>
            <i className='fa-solid fa-arrow-left'></i>
          </Button>
          <h2 className='text-primary bold mb-1'>
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
