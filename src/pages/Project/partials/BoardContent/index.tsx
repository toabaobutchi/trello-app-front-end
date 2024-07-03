import Flex from '@comps/StyledComponents/Flex'
import { ChangeTaskOrderModel, DragOverResult, ListResponseForBoard, TaskResponseForBoard } from '@utils/types'
import {
  DndContext,
  DragEndEvent,
  // MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DropAnimation,
  defaultDropAnimationSideEffects,
  DragOverEvent,
  Active,
  Over
  // closestCorners
} from '@dnd-kit/core'
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import SortableColumn from './SortableColumn'
import { useEffect, useRef, useState } from 'react'
import AddNewList from './AddNewList'
import TaskCard from '@comps/TaskCard'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@redux/store'
import { projectSlice } from '@redux/ProjectSlice'
import HttpClient from '@utils/HttpClient'
import { cloneDeep } from 'lodash'
import { HttpStatusCode } from 'axios'
import { MyCustomSensor } from '@utils/MyCustomSensor'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import config from '@confs/app.config'

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
  boardColor?: string
}

export type RemoteDraggingType = {
  isDragging?: boolean
  subId?: string
  dragObjectId?: string
  dragObject?: 'Column' | 'Card'
}

function BoardContent({ lists = [], boardColor = '#007bc2' }: BoardContentProps) {
  const dispatch = useDispatch<AppDispatch>()
  const project = useSelector((state: RootState) => state.project.activeProject.board)
  const account = useSelector((state: RootState) => state.login.accountInfo)
  // dùng để lưu trữ tạm thời để các kéo thả - sau đó cập nhật lại sau
  const [listState, setListState] = useState<ListResponseForBoard[]>([])
  const [activeDragItem, setActiveDragItem] = useState<ActiveDragItemType>()
  const [oldColumn, setOldColumn] = useState<ListResponseForBoard>()

  //real-time
  const [dragConnection, setDragConnection] = useState<HubConnection>()
  const [remoteDragging, setRemoteDragging] = useState<RemoteDraggingType>()

  useEffect(() => {
    const connection = new HubConnectionBuilder().withUrl(`${config.baseUrl}/dragHub`).build()
    connection
      .start()
      .then(() => {
        setDragConnection(connection)
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    setListState(lists)
  }, [lists])

  useEffect(() => {
    if (dragConnection) {
      dragConnection.on('ReceiveStartDragList', (assignmentId: string, listId: string) => {
        console.log(assignmentId, listId)
        setRemoteDragging({
          isDragging: true,
          subId: assignmentId,
          dragObjectId: listId,
          dragObject: 'Column'
        })
      })
    }
  }, [dragConnection])

  const findColumnByCardId = (cardId: string) => {
    return listState?.find(list => list?.tasks?.map(task => task.id).includes(cardId))
  }

  const moveCardsInDifferentColumns = (
    overList: ListResponseForBoard,
    active: Active,
    activeList: ListResponseForBoard,
    activeId: string,
    activeData: TaskResponseForBoard,
    over: Over,
    overId: string,
    callApi?: boolean
  ) => {
    const overCardIndex = overList.tasks?.findIndex(task => task.id === overId)
    // console.log(overCardIndex)
    const isBelowOverItem =
      active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
    const modifier = isBelowOverItem ? 1 : 0

    // nếu tìm thấy index thì xác định xem index mới cho card đang kéo thả là gì,
    // nếu không có gì thì đặt ở phía cuối (thường trong trường hợp mà cột ko còn item)
    const newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : (overList?.tasks?.length ?? -1) + 1

    const nextColumns = cloneDeep(listState)

    const nextActiveColumn = nextColumns?.find(c => c.id === activeList.id)
    const nextOverColumn = nextColumns?.find(c => c.id === overList.id)

    if (nextActiveColumn) {
      nextActiveColumn.tasks = nextActiveColumn.tasks?.filter(t => t.id !== activeId)
      nextActiveColumn.taskOrder = nextActiveColumn.tasks?.map(t => t.id).join(',')
      console.log('nextActiveColumn.id : ', nextActiveColumn.id)
    }

    if (nextOverColumn) {
      // kiểm tra - xoá trước
      nextOverColumn.tasks = nextOverColumn.tasks?.filter(t => t.id !== activeId)
      console.log('nextOverColumn.id : ', nextOverColumn.id)
      // thay doi listId
      const rebuildActiveData: TaskResponseForBoard = {
        ...(activeData as TaskResponseForBoard),
        listId: nextOverColumn.id
      }
      nextOverColumn.tasks = nextOverColumn.tasks?.toSpliced(newCardIndex, 0, rebuildActiveData)
      nextOverColumn.taskOrder = nextOverColumn.tasks?.map(t => t.id).join(',')
    }
    const changeTaskOrderModel: ChangeTaskOrderModel = {
      newListId: nextOverColumn?.id as string,
      newTaskOrder: nextOverColumn?.taskOrder as string,
      oldListId: nextActiveColumn?.id as string,
      oldTaskOrder: nextActiveColumn?.taskOrder as string
    }
    setListState(prev => nextColumns) // set truoc, cho response de quyet dinh sau
    if (callApi) {
      console.log(changeTaskOrderModel)
      http
        .putAuth(`/tasks/${activeId}/change-order`, changeTaskOrderModel)
        .then(res => {
          if (res?.status !== 200) {
            setListState(prev => lists)
          }
        })
        .catch(() => setListState(prev => lists))
    }
  }

  const handleDragStart = (e: DragEndEvent) => {
    setActiveDragItem({
      id: e?.active?.id,
      data: e?.active?.data?.current,
      dragObject: e?.active?.data?.current?.dragObject // `dragObject` được đặt trong mỗi TaskCard hoặc SortableColumn
    })
    if (e?.active?.data?.current?.dragObject === 'Card') {
      setOldColumn(findColumnByCardId(e?.active?.id as string))
    } else {
      if (dragConnection) dragConnection?.send('SendStartDragList', project?.id, account?.id, e?.active?.id)
    }
  }

  const handleDragOver = (e: DragOverEvent) => {
    // console.log('handleDragOver: ', e)
    if (activeDragItem?.dragObject === 'Column') return

    const { active, over } = e
    if (!active || !over) return

    const {
      id: activeId,
      data: { current: activeData }
    } = active
    const { id: overId } = over

    const activeList = findColumnByCardId(activeId as string)
    const overList = findColumnByCardId(overId as string)

    if (!activeList || !overList) return

    if (activeList.id !== overList.id) {
      moveCardsInDifferentColumns(
        overList,
        active,
        activeList,
        activeId as string,
        activeData as TaskResponseForBoard,
        over,
        overId as string
      )
    }
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!active || !over) return

    // trường hợp kéo thả card/task
    if (activeDragItem?.dragObject === 'Card') {
      const {
        id: activeId,
        data: { current: activeData }
      } = active
      const { id: overId } = over

      const activeList = findColumnByCardId(activeId as string)
      const overList = findColumnByCardId(overId as string)

      if (!activeList || !overList) return

      if (oldColumn?.id !== overList.id) {
        moveCardsInDifferentColumns(
          overList,
          active,
          oldColumn as ListResponseForBoard,
          activeId as string,
          activeData as TaskResponseForBoard,
          over,
          overId as string,
          true
        )
      } else {
        const oldCardIndex = oldColumn?.tasks?.findIndex(t => t.id === activeDragItem.id)
        const newCardIndex = overList?.tasks?.findIndex(t => t.id === overId)

        const newCardState = arrayMove(
          oldColumn?.tasks as TaskResponseForBoard[],
          oldCardIndex as number,
          newCardIndex as number
        )
        const nextColumns = cloneDeep(listState)
        const targetColumn = nextColumns?.find(c => c.id === overList.id)
        if (targetColumn) {
          targetColumn.tasks = newCardState
          targetColumn.taskOrder = newCardState.map(t => t.id).join(',')
        }
        const changeTaskOrderModel: ChangeTaskOrderModel = {
          newListId: targetColumn?.id as string,
          oldListId: targetColumn?.id as string,
          newTaskOrder: targetColumn?.taskOrder as string,
          oldTaskOrder: targetColumn?.taskOrder as string
        }
        setListState(nextColumns)
        http.putAuth(`/tasks/${activeDragItem.id}/change-order`, changeTaskOrderModel).then(res => {
          if (res?.status !== 200) {
            setListState(lists)
          }
        })
      }
    } // xử lý trường hợp kéo thả cột
    else {
      if (active.id !== over.id) {
        const oldIndex = listState?.findIndex(l => l.id === active.id)
        const newIndex = listState?.findIndex(l => l.id === over?.id)

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
    setActiveDragItem(undefined) // xoá `activeDragItem` khi dừng kéo thả
    setOldColumn(undefined)
  }

  // const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const customMouseSensor = useSensor(MyCustomSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })

  const sensors = useSensors(customMouseSensor, touchSensor)
  return (
    <>
      <DndContext
        // collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          disabled={remoteDragging?.isDragging}
          items={listState?.map(l => l?.id) ?? []}
          strategy={horizontalListSortingStrategy}
        >
          <Flex $gap='1.5rem' style={{ '--board-bg-color': boardColor } as React.CSSProperties} className='column-list'>
            {listState?.map(column => (
              <SortableColumn remoteDragging={remoteDragging} key={column.id} column={column} />
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
