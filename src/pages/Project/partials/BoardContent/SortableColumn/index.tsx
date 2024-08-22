import Column from '@comps/Column'
import TaskCard from '@comps/TaskCard'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { createCardId, mapOrder } from '@utils/functions'
import { BlockDragState } from '..'
import useProjectOutletContext from '@hooks/useProjectOutletContext'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { ListResponseForBoard } from '@utils/types/list.type'
import { TaskResponseForBoard } from '@utils/types/task.type'

function SortableColumn({ column, blockDragState }: { column: ListResponseForBoard; blockDragState?: BlockDragState }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: { ...column, dragObject: 'Column' }
  })
  const { remoteDragging } = useProjectOutletContext()
  const { board } = useProjectSelector()
  const tasks = mapOrder<TaskResponseForBoard>(
    column?.tasks as TaskResponseForBoard[],
    column?.taskOrder?.split(',') as string[],
    'id'
  )

  const style = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    border: isDragging ? '1px solid #4B70F5' : 'unset'
  }
  const isObserver = board.context.toLowerCase() === 'observer'
  return (
    <>
      <Column {...attributes} {...listeners} ref={setNodeRef} style={style} key={column.id} column={column}>
        <SortableContext
          disabled={isObserver || remoteDragging?.isDragging || blockDragState?.isDisabled}
          items={tasks?.map(t => createCardId(t)) as string[]}
          strategy={verticalListSortingStrategy}
        >
          {tasks?.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </Column>
    </>
  )
}

export default SortableColumn
