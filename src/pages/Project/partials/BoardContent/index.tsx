import Flex from '@comps/StyledComponents/Flex'
import { ChangeTaskOrderModel, ListResponseForBoard, TaskResponseForBoard } from '@utils/types'
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
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import SortableColumn from './SortableColumn'
import { useEffect, useRef, useState } from 'react'
import AddNewList from './AddNewList'
import TaskCard from '@comps/TaskCard'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@redux/store'
import { changeListOrder, projectSlice } from '@redux/ProjectSlice'
import HttpClient from '@utils/HttpClient'
import { cloneDeep } from 'lodash'
import { HttpStatusCode } from 'axios'

const http = new HttpClient()

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

type BoardContentProps = {
  lists?: ListResponseForBoard[]
}

type DragOverResult = {
  overList: ListResponseForBoard
  activeList: ListResponseForBoard
}

function BoardContent({ lists = [] }: BoardContentProps) {
  const dispatch = useDispatch<AppDispatch>()

  // dùng để lưu trữ tạm thời để các kéo thả - sau đó cập nhật lại sau
  const [listState, setListState] = useState<ListResponseForBoard[]>([])
  const [activeDragItem, setActiveDragItem] = useState<ActiveDragItemType>()
  const listStateWhenDraggingTask = useRef<ListResponseForBoard[]>() // khi thay đổi không cần render lại component
  const [dragOverResult, setDragOverResult] = useState<DragOverResult>()

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
    const activeList = listState?.find(l => l.id === activeData?.listId)
    const overList = listState?.find(l => l.id === overData?.listId)

    if (!activeList || !overList) return

    // if (activeList.id !== overList.id) {
    // xử lý kéo qua cột khác
    // tìm card bị active card kéo đến /ngang qua
    const overCardIndex = overList.tasks?.findIndex(t => t.id === overId) ?? -1

    const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height

    const modifier = isBelowOverItem ? 1 : 0

    // nếu tìm thấy index thì xác định xem index mới cho card đang kéo thả là gì,
    // nếu không có gì thì đặt ở phía cuối (thường trong trường hợp mà cột ko còn item)
    const newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : (overList?.tasks?.length ?? -1) + 1

    // sao chép dữ liệu - không làm ảnh hưởng đến các thành phần phía trên
    const newListState = cloneDeep(listState)
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
      // const newTask = nextOverList.tasks?.[newCardIndex]
      // if (newTask) {
      //   newTask.listId = overList.id
      // }
    }
    setDragOverResult({
      activeList: nextActiveList as ListResponseForBoard,
      overList: nextOverList as ListResponseForBoard
    })
    // setListState(newListState)
    //TODO lưu lại `nextActiveList` và `nextOverList`, sau đó trích xuất lấy `change_task_order` của 2 task đó
    listStateWhenDraggingTask.current = newListState // dùng cho thằng `handleDragEnd`
    setListState(newListState) // tạm thời set state để không bị giật UI
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!active || !over) return

    // trường hợp kéo thả card/task
    if (activeDragItem?.dragObject === 'Card') {
      // setListState(listStateWhenDraggingTask.current as ListResponseForBoard[])
      if (listStateWhenDraggingTask.current) {
        // có kéo thả ca(rd thì sẽ có giá trị
        setListState(listStateWhenDraggingTask.current)
        const updateData: ChangeTaskOrderModel = {
          oldTaskOrder: dragOverResult?.activeList.tasks?.map(t => t.id)?.join(',') as string,
          newTaskOrder: dragOverResult?.overList.tasks?.map(t => t.id)?.join(',') as string,
          newListId: dragOverResult?.overList.id as string,
          oldListId: dragOverResult?.activeList.id as string
        }
        http.putAuth(`/tasks/${activeDragItem?.id}/change-order`, updateData).then(res => {
          if (res?.status === HttpStatusCode.Ok) {
            // thay đổi store (dispatch)
            dispatch(projectSlice.actions.changeTaskOrder(res.data))
          } else {
            console.log('Không thể cập nhật')
            setListState(listState) // reset lại list state như ban đầu, huỷ cập nhật
          }
        })
      }
    } // xử lý trường hợp kéo thả cột
    else {
      if (active.id !== over.id) {
        const oldIndex = listState?.findIndex(l => l.id === active.id) ?? 0
        const newIndex = listState?.findIndex(l => l.id === over?.id) ?? 0

        if (oldIndex === newIndex) {
          // không có gì xảy ra
          return
        } else {
          // cập nhật lại danh sách
          const newListState = arrayMove(listState, oldIndex, newIndex)
          const newListOrder = newListState.map(l => l.id).join(',')
          // const previousListState = cloneDeep(listState)
          setListState(newListState) // tạm thời set lại - ngăn việc tạm dừng UI

          // gọi api cập nhật lại
          http.putAuth(`/lists/change-order`, { newListOrder }).then(res => {
            if (res?.status === 200) {
              // cập nhật lại thành công
              const updatedListOrder = res.data as string
              dispatch(projectSlice.actions.changeListOrder(updatedListOrder))
            } else {
              setListState(listState) // reset lại list state như ban đầu, huỷ cập nhật
            }
          })
        }
      }
    }
    listStateWhenDraggingTask.current = undefined // khi nào kéo thả card thì sẽ có giá trị
    setActiveDragItem(undefined) // xoá `activeDragItem` khi dừng kéo thả
    setDragOverResult(undefined)
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
        <SortableContext items={listState?.map(l => l?.id) ?? []} strategy={horizontalListSortingStrategy}>
          <Flex $gap='1.5rem' className='column-list'>
            {listState?.map(column => (
              <SortableColumn key={column.id} column={column} />
            ))}
            <AddNewList />
          </Flex>
        </SortableContext>
        <DragOverlay dropAnimation={dropAnimation}>
          {activeDragItem &&
            (activeDragItem.dragObject === 'Card' ? <TaskCard task={activeDragItem.data as TaskResponseForBoard} /> : <SortableColumn column={activeDragItem.data as ListResponseForBoard} />)}
        </DragOverlay>
      </DndContext>
    </>
  )
}

export default BoardContent
