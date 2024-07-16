import Flex from '@comps/StyledComponents/Flex'
import {
  ChangeTaskOrderModel,
  ChangeTaskOrderResponse,
  CreateTaskResponse,
  DragOverResult,
  ListResponseForBoard,
  SubtaskForBoard,
  TaskResponseForBoard,
  UpdatedTaskResponse
} from '@utils/types'
import {
  DndContext,
  DragEndEvent,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DropAnimation,
  defaultDropAnimationSideEffects,
  DragOverEvent,
  Active,
  Over
} from '@dnd-kit/core'
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import SortableColumn from './SortableColumn'
import { useEffect, useState } from 'react'
import AddNewList from './AddNewList'
import TaskCard from '@comps/TaskCard'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@redux/store'
import { projectSlice } from '@redux/ProjectSlice'
import HttpClient from '@utils/HttpClient'
import { cloneDeep } from 'lodash'
import { MyCustomSensor } from '@utils/MyCustomSensor'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import config from '@confs/app.config'
import { filterLists } from '@utils/functions'
import { DragHub } from '@utils/Hubs'

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

export type RemoteDraggingType = {
  isDragging?: boolean
  subId?: string
  dragObjectId?: string
  dragObject?: 'Column' | 'Card'
}

function BoardContent() {
  const dispatch = useDispatch<AppDispatch>()
  const project = useSelector((state: RootState) => state.project.activeProject)
  const account = useSelector((state: RootState) => state.login.accountInfo)
  // dùng để lưu trữ tạm thời để các kéo thả - sau đó cập nhật lại sau
  const [listState, setListState] = useState<ListResponseForBoard[]>([])
  const [activeDragItem, setActiveDragItem] = useState<ActiveDragItemType>()
  const [oldColumn, setOldColumn] = useState<ListResponseForBoard>()

  //signalR
  const [dragHub] = useState<DragHub>(new DragHub())
  const [remoteDragging, setRemoteDragging] = useState<RemoteDraggingType>()

  const listJson = JSON.stringify(project?.board?.lists)
  useEffect(() => {
    const lists = filterLists(project?.board?.lists, project?.currentFilters)
    setListState(prev => lists as ListResponseForBoard[])
  }, [project?.board?.lists, listJson, dispatch, project?.currentFilters, project?.changeId])

  useEffect(() => {
    if (project?.board?.id) {
      // if (dragHub) dragHub.stop()
      // const connection = new HubConnectionBuilder()
      //   .withUrl(`${config.baseUrl}/dragHub`)
      //   .withAutomaticReconnect()
      //   .build()
      // connection.start().then(() => {
      //   setDragHub(connection)
      //   connection.invoke('SendAddToDragGroup', project?.board?.id, account?.id)
      // })
      console.log('Connect ', project?.board?.id)
      if (!dragHub.isConnected) dragHub.connection?.invoke('SendAddToDragGroup').catch(() => {})
    }

    return () => {
      // if (dragHub) dragHub.stop()
      if (dragHub.isConnected) {
        dragHub.connection?.stop()
      }
    }
  }, [account.id, project?.board?.id])

  // signalr listeners
  useEffect(() => {
    if (dragHub.isConnected && project?.board?.id) {
      dragHub.connection?.on('ReceiveStartDragList', (assignmentId: string, listId: string) => {
        setRemoteDragging({
          isDragging: true,
          subId: assignmentId,
          dragObjectId: listId,
          dragObject: 'Column'
        })
      })

      dragHub.connection?.on('ReceiveEndDragList', (assignmentId: string, updatedListOrder: string) => {
        dispatch(projectSlice.actions.changeListOrder(updatedListOrder))
        setTimeout(() => {
          if (remoteDragging) setRemoteDragging(undefined)
        }, 500)
      })

      dragHub.connection?.on(
        'ReceiveStartDragTask',
        (assignmentId: string, updatedListOrder: string, taskId: string) => {
          setRemoteDragging({
            isDragging: true,
            subId: assignmentId,
            dragObjectId: taskId,
            dragObject: 'Card'
          })
        }
      )

      dragHub.connection?.on(
        'ReceiveEndDragTask',
        (assignmentId: string, res: ChangeTaskOrderResponse, dragResult: DragOverResult) => {
          dispatch(projectSlice.actions.changeTaskOrder({ resData: res, dragOverResult: dragResult }))
          // setRemoteDragging(undefined)
          setTimeout(() => {
            if (remoteDragging) setRemoteDragging(undefined)
          }, 500)
        }
      )
      dragHub.connection?.on('ReceiveUpdateTaskInfo', (assignmentId: string, data: UpdatedTaskResponse) => {
        dispatch(projectSlice.actions.updateTaskInfo(data))
      })
      dragHub.connection?.on(
        'ReceiveAddSubtaskResult',
        (assignmentId: string, taskid: string, subtasks: SubtaskForBoard[]) => {
          dispatch(projectSlice.actions.changeSubtaskCount({ taskId: taskid, subtaskCount: subtasks.length }))
        }
      )
      dragHub.connection?.on('ReceiveDeleteSubtask', (assignmentId: string, taskid: string, subtaskId: number) => {
        dispatch(projectSlice.actions.changeSubtaskCount({ taskId: taskid, subtaskCount: -1 }))
      })
      dragHub.connection?.on(
        'ReceiveCheckSubtask',
        (assignmentId: string, taskid: string, subtaskId: number, status: boolean) => {
          dispatch(projectSlice.actions.changeSubtaskStatus({ taskId: taskid, status }))
        }
      )
      dragHub.connection?.on('ReceiveAddNewTask', (assignmentId: string, data: CreateTaskResponse) => {
        console.log('ReceiveAddNewTask')
        dispatch(projectSlice.actions.addNewTask(data))
      })
    }
  }, [dragHub, dispatch])

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
    }

    if (nextOverColumn) {
      // kiểm tra - xoá trước
      nextOverColumn.tasks = nextOverColumn.tasks?.filter(t => t.id !== activeId)
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
      http
        .putAuth(`/tasks/${activeId}/change-order`, changeTaskOrderModel)
        .then(res => {
          if (res?.status !== 200) {
            console.log('Update task order failed')
            setListState(prev => project?.board?.lists as ListResponseForBoard[])
          } else {
            const dragOverResult: DragOverResult = {
              activeList: nextActiveColumn as ListResponseForBoard,
              overList: nextOverColumn
            }
            dispatch(projectSlice.actions.changeTaskOrder({ dragOverResult, resData: res?.data }))
            // call hub
            if (dragHub) {
              // dragHub?.send('SendEndDragTask', project?.board?.id, account?.id, res?.data, dragOverResult)
            }
          }
        })
        .catch(() => setListState(prev => project?.board?.lists as ListResponseForBoard[]))
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
      if (dragHub) {
        // dragHub?.send(
        //   'SendStartDragTask',
        //   project?.board?.id,
        //   account?.id,
        //   e?.active?.data?.current?.listId,
        //   e?.active?.id
        // )
      }
    } else {
      // if (dragHub) dragHub?.send('SendStartDragList', project?.board?.id, account?.id, e?.active?.id)
    }
  }

  const handleDragOver = (e: DragOverEvent) => {
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
      // nếu có chỉ định wip limit và số lượng task trong list đã đủ thì ngừng lại
      if (overList.wipLimit && overList.tasks?.length && overList.tasks?.length > overList.wipLimit) return
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
        // thay doi card tren 2 column
        if (overList.wipLimit && overList.tasks?.length && overList.tasks?.length > overList.wipLimit) return
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
      }
      // thay doi card tren 1 column
      else {
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
        setListState(prev => nextColumns)
        http.putAuth(`/tasks/${activeDragItem.id}/change-order`, changeTaskOrderModel).then(res => {
          if (res?.status !== 200) {
            console.log('Update task order failed')
            setListState(prev => project?.board?.lists as ListResponseForBoard[])
          } else {
            const dragOverResult: DragOverResult = {
              activeList: targetColumn as ListResponseForBoard,
              overList: targetColumn
            }
            dispatch(projectSlice.actions.changeTaskOrder({ dragOverResult, resData: res?.data }))
            // call hub
            if (dragHub) {
              // dragHub?.send('SendEndDragTask', project?.board?.id, account?.id, res?.data, dragOverResult)
            }
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
              if (dragHub) {
                // dragHub?.send('SendEndDragList', project?.board?.id, account?.id, updatedListOrder)
              }
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
  const handleScroll = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.currentTarget.scrollLeft += e.deltaY
    }
  }
  return (
    <>
      <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} sensors={sensors}>
        <SortableContext
          disabled={remoteDragging?.isDragging}
          items={listState?.map(l => l?.id) ?? []}
          strategy={horizontalListSortingStrategy}
        >
          <Flex $gap='1.5rem' className='column-list' onWheel={handleScroll}>
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
