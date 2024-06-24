import Flex from '@comps/StyledComponents/Flex'
import { ListResponseForBoard, TaskResponseForBoard } from '@utils/types'
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DropAnimation,
  defaultDropAnimationSideEffects,
  DragOverEvent
} from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import SortableColumn from './SortableColumn'
import { useEffect, useState } from 'react'
import AddNewList from './AddNewList'
import TaskCard from '@comps/TaskCard'
import { cloneDeep } from 'lodash'

type ActiveDragItemType = {
  id?: string | number
  data?: object
  dragObject?: 'Column' | 'Card'
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5'
      }
    }
  })
}

function BoardContent({ lists }: { lists: ListResponseForBoard[] }) {
  const [listState, setListState] = useState([] as ListResponseForBoard[])
  const [activeDragItem, setActiveDragItem] = useState<ActiveDragItemType>()
  console.log('listState >>> ', listState)
  useEffect(() => {
    setListState(lists)
  }, [lists])

  const handleDragStart = (e: DragEndEvent) => {
    setActiveDragItem({
      id: e?.active?.id,
      data: e?.active?.data?.current,
      dragObject: e?.active?.data?.current?.dragObject // `dragObject` được đặt trong mỗi TaskCard hoặc SortableColumn
    })
  }

  const handleDragOver = (e: DragOverEvent) => {
    if (activeDragItem?.dragObject === 'Column') return

    const { active, over } = e
    if (!active || !over) return

    const {
      id: activeId,
      data: { current: activeData }
    } = active
    const {
      id: overId,
      data: { current: overData }
    } = over

    // tìm column của 2 card đang tương tác
    const activeColumn = listState.find(l => l.id === activeData?.listId)
    const overColumn = listState.find(l => l.id === overData?.listId)

    if (!activeColumn || !overColumn) return

    if (activeColumn.id !== overColumn.id) {
      // xử lý kéo qua cột khác
      setListState(prevList => {
        // tìm card bị active card kéo đến /ngang qua
        const overCardIndex = overColumn.tasks?.findIndex(t => t.id === overId) ?? -1

        const isBelowOverItem =
          active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height

        const modifier = isBelowOverItem ? 1 : 0

        // nếu tìm thấy index thì xác định xem index mới cho card đang kéo thả là gì, 
        // nếu không có gì thì đặt ở phía cuối (thường trong trường hợp mà cột ko còn item)
        const newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : (overColumn?.tasks?.length ?? -1) + 1

        // sao chép dữ liệu - không làm ảnh hưởng đến các thành phần phía trên
        const newColumns = cloneDeep(prevList)
        const nextActiveColumn = newColumns.find(c => c.id === activeColumn.id)
        const nextOverColumn = newColumns.find(c => c.id === overColumn.id)

        if (nextActiveColumn) {
          // xoá card active (card đang được kéo đi) trong danh sách chứa nó
          nextActiveColumn.tasks = nextActiveColumn.tasks?.filter(t => t.id !== activeId)
        }
        if (nextOverColumn) {
          // nếu cột được kéo qua đã tồn tại một card như vậy thì xoá trước rồi đặt lại vô sau
          nextOverColumn.tasks = nextOverColumn.tasks?.filter(t => t.id !== activeId)
          nextOverColumn.tasks = nextOverColumn.tasks?.toSpliced(newCardIndex, 0, activeData as TaskResponseForBoard)

          // thay đổi `listId` của card được kéo qua
          // ở đoạn trên có sử dụng `listId` để tìm kiếm `activeColumn` và `overColumn`
          // nên phải cập nhật lại, nếu không lần tìm kiếm sau sẽ gặp vấn đề
          const newTask = nextOverColumn.tasks?.[newCardIndex]
          if (newTask) {
            newTask.listId = overColumn.id
          }
        }

        return newColumns
      })
    }
  }

  const handleDragEnd = (e: DragEndEvent) => {
    if (activeDragItem?.dragObject === 'Card') {
      return
    }

    const { active, over } = e
    if (active.id !== over?.id) {
      if (!over) return

      const oldIndex = listState.findIndex(l => l.id === active.id)
      const newIndex = listState.findIndex(l => l.id === over?.id)

      const newListState = arrayMove(listState, oldIndex, newIndex)
      setListState(newListState)
    }
    setActiveDragItem(undefined) // xoá `activeDragItem` khi dừng kéo thả
  }

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })

  const sensors = useSensors(mouseSensor, touchSensor)

  return (
    <>
      <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} sensors={sensors}>
        <SortableContext items={listState?.map(l => l.id)} strategy={horizontalListSortingStrategy}>
          <Flex $gap='1.5rem' className='column-list'>
            {listState?.map(column => (
              <SortableColumn key={column.id} column={column} />
            ))}
            <AddNewList />
          </Flex>
        </SortableContext>
        <DragOverlay dropAnimation={dropAnimation}>
          {activeDragItem &&
            (activeDragItem.dragObject === 'Card' ? (
              <TaskCard task={activeDragItem.data as TaskResponseForBoard} />
            ) : (
              <SortableColumn column={activeDragItem.data as ListResponseForBoard} />
            ))}
        </DragOverlay>
      </DndContext>
    </>
  )
}

export default BoardContent
