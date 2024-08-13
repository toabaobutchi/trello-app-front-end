import { useProjectSelector } from '@hooks/useProjectSelector'
import ListStateItem from './ListStateItem'

function ListState() {
  const { board: project } = useProjectSelector()
  return (
    <div className='overview-card list-state'>
      <p className='list-state-header'>Lists of cards</p>
      <div className='list-state-container'>
        {project?.lists?.map(list => (
          <ListStateItem key={list.id} list={list} />
        ))}
      </div>
    </div>
  )
}

export default ListState
