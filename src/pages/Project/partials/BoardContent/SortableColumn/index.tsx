import Column from '@comps/Column'
import TaskCard from '@comps/TaskCard'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { createCardId, mapOrder } from '@utils/functions'
import { ListResponseForBoard, TaskResponseForBoard } from '@utils/types'
import { BlockDragState, RemoteDraggingType } from '..'

function SortableColumn({
  column,
  remoteDragging,
  blockDragState
}: {
  column: ListResponseForBoard
  remoteDragging?: RemoteDraggingType
  blockDragState?: BlockDragState
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: { ...column, dragObject: 'Column' }
  })

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
  return (
    <>
      <Column
        remoteDragging={remoteDragging}
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        style={style}
        key={column.id}
        column={column}
      >
        <SortableContext
          disabled={remoteDragging?.isDragging || blockDragState?.isDisabled}
          items={tasks?.map(t => createCardId(t)) as string[]}
          strategy={verticalListSortingStrategy}
        >
          {tasks?.map(task => (
            <TaskCard remoteDragging={remoteDragging} key={task.id} task={task} />
          ))}
        </SortableContext>
      </Column>
    </>
  )
}

export default SortableColumn
