import Flex from '@comps/StyledComponents/Flex'
import { ListResponseForBoard } from '@utils/types'
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import SortableColumn from './SortableColumn'
import { useEffect, useState } from 'react'
import AddNewList from './AddNewList'

function BoardContent({ lists }: { lists: ListResponseForBoard[] }) {
  const [listState, setListState] = useState([] as ListResponseForBoard[])
  useEffect(() => {
    setListState(lists)
  }, [lists])

  const handleDragStart = (e: DragEndEvent) => {
    console.log('handleDragStart', e)
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (active.id !== over?.id) {
      if (!over) return

      const oldIndex = listState.findIndex(l => l.id === active.id)
      const newIndex = listState.findIndex(l => l.id === over?.id)

      const newListState = arrayMove(listState, oldIndex, newIndex)
      setListState(newListState)
    }
  }

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })

  const sensors = useSensors(mouseSensor, touchSensor)

  return (
    <>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
        <SortableContext items={listState?.map(l => l.id)} strategy={horizontalListSortingStrategy}>
          <Flex $gap='1.5rem' className='column-list'>
            {listState?.map(column => (
              <SortableColumn key={column.id} column={column} />
            ))}
            <AddNewList />
          </Flex>
        </SortableContext>
      </DndContext>
    </>
  )
}

export default BoardContent
