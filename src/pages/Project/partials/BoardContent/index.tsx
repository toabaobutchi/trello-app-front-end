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
  // closestCorners
} from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import SortableColumn from './SortableColumn'
import { useEffect, useRef, useState } from 'react'
import AddNewList from './AddNewList'
import TaskCard from '@comps/TaskCard'
import { cloneDeep } from 'lodash'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'

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

function BoardContent() {
  const project = useSelector((state: RootState) => state.project.activeProject.board)

  // dùng để lưu trữ tạm thời để các kéo thả - sau đó cập nhật lại sau
  const listState = useRef(project.lists)

  // Lưu lại đối tượng đang được kéo thả - dùng để xác định xem là card hay column để mà xử lý
  const [activeDragItem, setActiveDragItem] = useState<ActiveDragItemType>()

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
    const activeList = project?.lists?.find(l => l.id === activeData?.listId)
    const overList = project?.lists?.find(l => l.id === overData?.listId)

    if (!activeList || !overList) return

    // if (activeList.id !== overList.id) {
    // xử lý kéo qua cột khác
    // tìm card bị active card kéo đến /ngang qua
    const overCardIndex = overList.tasks?.findIndex(t => t.id === overId) ?? -1

    const isBelowOverItem =
      active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height

    const modifier = isBelowOverItem ? 1 : 0

    // nếu tìm thấy index thì xác định xem index mới cho card đang kéo thả là gì,
    // nếu không có gì thì đặt ở phía cuối (thường trong trường hợp mà cột ko còn item)
    const newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : (overList?.tasks?.length ?? -1) + 1

    // sao chép dữ liệu - không làm ảnh hưởng đến các thành phần phía trên
    const newListState = cloneDeep(listState?.current)
    const nextActiveList = newListState?.find(c => c.id === activeList.id)
    const nextOverList = newListState?.find(c => c.id === overList.id)

    if (nextActiveList) {
      // xoá card active (card đang được kéo đi) trong danh sách chứa nó
      nextActiveList.tasks = nextActiveList.tasks?.filter(t => t.id !== activeId)
    }
    if (nextOverList) {
      // nếu cột được kéo qua đã tồn tại một card như vậy thì xoá trước rồi đặt lại vô sau
      nextOverList.tasks = nextOverList.tasks?.filter(t => t.id !== activeId)
      nextOverList.tasks = nextOverList.tasks?.toSpliced(newCardIndex, 0, activeData as TaskResponseForBoard)

      // thay đổi `listId` của card được kéo qua
      // ở đoạn trên có sử dụng `listId` để tìm kiếm `activeColumn` và `overList`
      // nên phải cập nhật lại, nếu không lần tìm kiếm sau sẽ gặp vấn đề
      const newTask = nextOverList.tasks?.[newCardIndex]
      if (newTask) {
        newTask.listId = overList.id
      }
    }
    listState.current = newListState
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!active || !over) return

    if (activeDragItem?.dragObject === 'Card') {
      const {
        id: activeId,
        data: { current: activeData }
      } = active
      const {
        id: overId,
        data: { current: overData }
      } = over


      //FIXME - Làm chức năng thêm task rồi thực hiện tiếp phần này - cập nhật lại cho redux

      // tìm column của 2 card đang tương tác
      const activeColumn = project?.lists?.find(l => l.id === activeData?.listId)
      const overColumn = project?.lists?.find(l => l.id === overData?.listId)

      if (!activeColumn || !overColumn) return



    } // xử lý trường hợp kéo thả cột
    else {
      if (active.id !== over.id) {
        const oldIndex = listState?.current?.findIndex(l => l.id === active.id) ?? 0
        const newIndex = listState?.current?.findIndex(l => l.id === over?.id) ?? 0

        const newListState = arrayMove(listState.current as ListResponseForBoard[], oldIndex, newIndex)
        listState.current = newListState
      }
    }

    setActiveDragItem(undefined) // xoá `activeDragItem` khi dừng kéo thả
  }

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })

  const sensors = useSensors(mouseSensor, touchSensor)

  return (
    <>
      <DndContext
        // collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext items={project?.lists?.map(l => l.id) ?? []} strategy={horizontalListSortingStrategy}>
          <Flex $gap='1.5rem' className='column-list'>
            {project?.lists?.map(column => (
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