import Column from '@comps/Column'
import TaskCard from '@comps/TaskCard'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { createCardId } from '@utils/functions'
import { ListResponseForBoard } from '@utils/types'

function SortableColumn({ column }: { column: ListResponseForBoard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: { ...column, dragObject: 'Column' }
  })

  const style = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }
  return (
    <>
      <Column {...attributes} {...listeners} ref={setNodeRef} style={style} key={column.id} column={column}>
        <SortableContext
          items={column.tasks?.map(t => createCardId(t)) as string[]}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks?.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </Column>
    </>
  )
}

export default SortableColumn
