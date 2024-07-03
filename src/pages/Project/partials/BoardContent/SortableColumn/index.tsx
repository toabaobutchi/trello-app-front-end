import Column from '@comps/Column'
import TaskCard from '@comps/TaskCard'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { createCardId, mapOrder } from '@utils/functions'
import { ListResponseForBoard, TaskResponseForBoard } from '@utils/types'
import { RemoteDraggingType } from '..'

function SortableColumn({
  column,
  remoteDragging
}: {
  column: ListResponseForBoard
  remoteDragging?: RemoteDraggingType
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

  // let tasks = cloneDeep(column.tasks)
  // const order = column.taskOrder?.split(',')
  // tasks = tasks?.sort((a, b) => order?.indexOf(a.id) ?? 0 - (order?.indexOf(b.id) ?? 0))
  const style = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
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
        <SortableContext items={tasks?.map(t => createCardId(t)) as string[]} strategy={verticalListSortingStrategy}>
          {tasks?.map(task => (
            <TaskCard remoteDragging={remoteDragging} key={task.id} task={task} />
          ))}
        </SortableContext>
      </Column>
    </>
  )
}

export default SortableColumn
