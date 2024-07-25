import { useLoaderData } from 'react-router-dom'
import './RecycleBin.scss'
import { AxiosResponse } from 'axios'
import { InTrashTaskResponse } from '@utils/types'
import DeletedTaskCard from './DeletedTaskCard'

function RecycleBin() {
  const response = useLoaderData() as AxiosResponse
  const deletedTasks = response.data as InTrashTaskResponse[]
  return (
    <>
      <div className='deleted-tasks-container'>
        {deletedTasks?.map(item => {
          return <DeletedTaskCard deletedTask={item} key={item.id} />
        })}
      </div>
    </>
  )
}

export default RecycleBin
