import Column from '@comps/Column'
import TaskCard from '@comps/TaskCard'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ListForBoard } from '@utils/types'

function SortableColumn({ column }: { column: ListForBoard }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: column.id,
    data: { ...column }
  })

  const style = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition
  }
  return (
    <>
      <Column {...attributes} {...listeners} ref={setNodeRef} style={style} key={column.id} column={column}>
        {column.tasks?.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Column>
    </>
  )
}

export default SortableColumn
