import Flex from '@comps/StyledComponents/Flex'
import {
  AssignByTaskResponse,
  ChangeTaskOrderModel,
  ChangeTaskOrderResponse,
  CreateListResponse,
  CreateTaskResponse,
  DeletedTaskAssignmentResponse,
  DispatchRelatedTaskResponse,
  DragOverResult,
  JoinTaskResponse,
  ListResponseForBoard,
  MarkedTaskResponse,
  RelatedTaskResponse,
  SubtaskForBoard,
  TaskResponseForBoard,
  UnassignSubtaskResponse,
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
import { useEffect, useRef, useState } from 'react'
import AddNewList from './AddNewList'
import TaskCard from '@comps/TaskCard'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@redux/store'
import { projectSlice } from '@redux/ProjectSlice'
import { cloneDeep } from 'lodash'
import { MyCustomSensor } from '@utils/MyCustomSensor'
import { filterLists } from '@utils/functions'
import { hubs, ProjectHub } from '@utils/Hubs'
import { changeTaskOrder } from '@services/task.services'
import { changeListOrder } from '@services/list.services'
import config from '@confs/app.config'

type ActiveDragItemType = {
  id?: string | number
  data?: object
  dragObject?: 'Column' | 'Card'
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
        transition: '0.25s linear'
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

export type BlockDragState = {
  timeOutId?: number
  isDisabled?: boolean
}

function BoardContent() {
  const dispatch = useDispatch<AppDispatch>()
  const project = useSelector((state: RootState) => state.project.activeProject)
  // dùng để lưu trữ tạm thời để các kéo thả - sau đó cập nhật lại sau
  const [listState, setListState] = useState<ListResponseForBoard[]>([])
  const [activeDragItem, setActiveDragItem] = useState<ActiveDragItemType>()
  const [oldColumn, setOldColumn] = useState<ListResponseForBoard>()
  const remoteDragTimeOutId = useRef<number>()
  const [blockDragState, setBlockDragState] = useState<BlockDragState>({ isDisabled: false })

  //signalR
  const [projectHub] = useState<ProjectHub>(new ProjectHub())
  const [remoteDragging, setRemoteDragging] = useState<RemoteDraggingType>()

  useEffect(() => {
    const lists = filterLists(project?.board?.lists, project?.currentFilters)
    setListState(_prev => lists as ListResponseForBoard[])
  }, [project?.board?.lists, dispatch, project?.currentFilters, project?.changeId])

  // signalr listeners
  useEffect(() => {
    console.log('Board content', project?.board?.id, projectHub.isConnected)
    if (project?.board?.id && projectHub.isConnected) {
      // ReceiveStartDragList
      projectHub.connection?.on(hubs.project.receive.startDragList, (assignmentId: string, listId: string) => {
        setRemoteDragging({
          isDragging: true,
          subId: assignmentId,
          dragObjectId: listId,
          dragObject: 'Column'
        })

        // nếu có thêm một request nữa thì reset lại bộ đếm giờ
        if (remoteDragTimeOutId.current) {
          clearTimeout(remoteDragTimeOutId.current)
          remoteDragTimeOutId.current = undefined
        }

        // chờ 60s sau sẽ tự động tắt
        remoteDragTimeOutId.current = setTimeout(() => {
          setRemoteDragging(_prev => undefined)
          remoteDragTimeOutId.current = undefined
        }, config.timeOut.drag)
      })
      // ReceiveEndDragList
      projectHub.connection?.on(hubs.project.receive.endDragList, (_assignmentId: string, updatedListOrder: string) => {
        dispatch(projectSlice.actions.changeListOrder(updatedListOrder))
        setTimeout(() => {
          setRemoteDragging(_prev => undefined)

          // xoá đi bộ đếm giờ nếu nhận được tín hiệu ngừng dưới 60s
          if (remoteDragTimeOutId.current) {
            clearTimeout(remoteDragTimeOutId.current)
            remoteDragTimeOutId.current = undefined
          }
        }, config.timeOut.delayAfterEndDrag)
      })
      // ReceiveStartDragTask
      projectHub.connection?.on(
        hubs.project.receive.startDragTask,
        (assignmentId: string, _updatedListOrder: string, taskId: string) => {
          setRemoteDragging({
            isDragging: true,
            subId: assignmentId,
            dragObjectId: taskId,
            dragObject: 'Card'
          })

          // nếu có thêm một request nữa thì reset lại bộ đếm giờ
          if (remoteDragTimeOutId.current) {
            clearTimeout(remoteDragTimeOutId.current)
            remoteDragTimeOutId.current = undefined
          }

          // chờ 60s sau sẽ tự động tắt
          remoteDragTimeOutId.current = setTimeout(() => {
            setRemoteDragging(_prev => undefined)
            remoteDragTimeOutId.current = undefined
          }, config.timeOut.drag)
        }
      )
      // ReceiveEndDragTask
      projectHub.connection?.on(
        hubs.project.receive.endDragTask,
        (_assignmentId: string, res: ChangeTaskOrderResponse, dragResult: DragOverResult) => {
          dispatch(projectSlice.actions.changeTaskOrder({ resData: res, dragOverResult: dragResult }))
          // setRemoteDragging(undefined)
          setTimeout(() => {
            setRemoteDragging(_prev => undefined)

            // xoá đi bộ đếm giờ nếu nhận được tín hiệu ngừng dưới 60s
            if (remoteDragTimeOutId.current) {
              clearTimeout(remoteDragTimeOutId.current)
              remoteDragTimeOutId.current = undefined
            }
          }, config.timeOut.delayAfterEndDrag)
        }
      )
      // ReceiveUpdateTaskInfo
      projectHub.connection?.on(
        hubs.project.receive.updateTaskInfo,
        (_assignmentId: string, data: UpdatedTaskResponse) => {
          dispatch(projectSlice.actions.updateTaskInfo(data))
        }
      )
      // ReceiveAddSubtaskResult
      projectHub.connection?.on(
        hubs.project.receive.addSubtaskResult,
        (_assignmentId: string, taskid: string, subtasks: SubtaskForBoard[]) => {
          dispatch(projectSlice.actions.changeSubtaskCount({ taskId: taskid, subtaskCount: subtasks.length }))
        }
      )
      // ReceiveDeleteSubtask
      projectHub.connection?.on(
        hubs.project.receive.deleteSubtask,
        (_assignmentId: string, taskid: string, _subtaskId: number) => {
          dispatch(projectSlice.actions.changeSubtaskCount({ taskId: taskid, subtaskCount: -1 }))
        }
      )
      // ReceiveCheckSubtask
      projectHub.connection?.on(
        hubs.project.receive.checkSubtask,
        (_assignmentId: string, taskid: string, _subtaskId: number, status: boolean) => {
          dispatch(projectSlice.actions.changeSubtaskStatus({ taskId: taskid, status }))
        }
      )
      // ReceiveAddNewTask
      projectHub.connection?.on(hubs.project.receive.addNewTask, (_assignmentId: string, data: CreateTaskResponse) => {
        dispatch(projectSlice.actions.addNewTask(data))
      })
      // SendAddNewList
      projectHub.connection?.on(hubs.project.receive.addNewList, (_assignmentId: string, data: CreateListResponse) => {
        dispatch(projectSlice.actions.addNewList(data))
      })
      // SendDeleteList
      projectHub.connection?.on(hubs.project.receive.deleteList, (_assignmentId: string, listId: string) => {
        dispatch(projectSlice.actions.deleteList(listId))
      })
      projectHub.connection?.on(hubs.project.receive.markTask, (_assignmentId: string, data: MarkedTaskResponse) => {
        dispatch(projectSlice.actions.markTask(data))
      })
      projectHub.connection?.on(
        hubs.project.receive.assignMemberToTask,
        (_assignmentId: string, data: AssignByTaskResponse) => {
          dispatch(projectSlice.actions.addAssignmentToTask(data))
        }
      )
      projectHub.connection?.on(
        hubs.project.receive.duplicateTasks,
        (_assignmentId: string, data: TaskResponseForBoard) => {
          dispatch(projectSlice.actions.setDuplicateTasks(data))
        }
      )
      projectHub.connection?.on(hubs.project.receive.joinTask, (_assignmentId: string, data: JoinTaskResponse) => {
        dispatch(projectSlice.actions.joinTask(data))
      })
      projectHub.connection?.on(
        hubs.project.receive.unassignTaskAssignment,
        (_assignmentId: string, data: DeletedTaskAssignmentResponse) => {
          dispatch(projectSlice.actions.removeTaskAssignment(data))
        }
      )
      projectHub.connection?.on(
        hubs.project.receive.addTaskDependencies,
        (_assignmentId: string, taskId: string, relatedTasks: RelatedTaskResponse[]) => {
          console.log('addTaskDependencies')
          dispatch(
            projectSlice.actions.addFromDependencies({
              taskId,
              relatedTasks
            } as DispatchRelatedTaskResponse)
          )
        }
      )
      projectHub.connection?.on(
        hubs.project.receive.addChildrenTasks,
        (_assignmentId: string, taskId: string, relatedTasks: RelatedTaskResponse[]) => {
          dispatch(
            projectSlice.actions.addFromChildren({
              taskId,
              relatedTasks
            } as DispatchRelatedTaskResponse)
          )
        }
      )
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [projectHub.isConnected, project?.board?.id])

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
    const overCardIndex = overList.tasks?.findIndex(task => task.id === overId) ?? -1
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
    setListState(_prev => nextColumns) // set truoc, cho response de quyet dinh sau
    if (callApi) {
      changeTaskOrder(activeId, changeTaskOrderModel)
        .then(res => {
          if (!res?.isSuccess) {
            console.log('Update task order failed')
            setListState(_prev => project?.board?.lists as ListResponseForBoard[])
          } else {
            const dragOverResult: DragOverResult = {
              activeList: nextActiveColumn as ListResponseForBoard,
              overList: nextOverColumn
            }
            const data = res.data
            dispatch(projectSlice.actions.changeTaskOrder({ dragOverResult, resData: data }))
            // call hub
            if (projectHub.isConnected) {
              projectHub.connection?.send(hubs.project.send.endDragTask, data, dragOverResult)
            }
          }
        })
        .catch(() => setListState(_prev => project?.board?.lists as ListResponseForBoard[]))
    }
  }

  const handleDragStart = (e: DragEndEvent) => {
    setActiveDragItem({
      id: e?.active?.id,
      data: e?.active?.data?.current,
      dragObject: e?.active?.data?.current?.dragObject // `dragObject` được đặt trong mỗi TaskCard hoặc SortableColumn
    })

    // sau 60s mà chưa clear cái timeout này thì sẽ block người dùng
    const timeOutId = setTimeout(() => {
      setBlockDragState(prev => ({ ...prev, isDisabled: true }))

      // roll back UI
      setListState(filterLists(project?.board?.lists, project?.currentFilters))

      // sau 60s sẽ mở lại
      setTimeout(() => {
        setBlockDragState(prev => ({ ...prev, isDisabled: false }))
      }, config.timeOut.dragBlock)
    }, config.timeOut.drag)

    // set timeout id
    setBlockDragState(prev => ({ ...prev, timeOutId: timeOutId }))

    if (e?.active?.data?.current?.dragObject === 'Card') {
      setOldColumn(findColumnByCardId(e?.active?.id as string))
      if (projectHub.isConnected) {
        // SendStartDragTask
        projectHub.connection?.send(hubs.project.send.startDragTask, e?.active?.data?.current?.listId, e?.active?.id)
      }
    } else {
      // SendStartDragList
      if (projectHub.isConnected) projectHub.connection?.send(hubs.project.send.startDragList, e?.active?.id)
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
      if (overList.wipLimit && overList.tasks?.length && overList.tasks?.length === overList.wipLimit) {
        console.log('WIP Limit: ' + overList.wipLimit, overList.tasks?.length)
        return
      }
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
    // clear timeout nếu như `isDisabled = false`
    if (!blockDragState.isDisabled) {
      clearTimeout(blockDragState.timeOutId)
      setBlockDragState(prev => ({ ...prev, timeOutId: undefined }))
    }

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

      // xử lý trường hợp kéo thả vào column rỗng
      // khi kéo vào column rỗng thì over là column chứ không còn là card
      let overList: ListResponseForBoard | undefined = undefined
      if (over?.data?.current?.dragObject == 'Column') {
        overList = listState?.find(l => l.id === overId)
      } else overList = findColumnByCardId(overId as string)

      // const overList = findColumnByCardId(overId as string)

      if (!activeList || !overList) return

      if (oldColumn?.id !== overList.id) {
        // thay doi card tren 2 column
        if (overList.wipLimit && overList.tasks?.length && overList.tasks?.length === overList.wipLimit) return
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
        setListState(_prev => nextColumns)
        if (activeDragItem?.id) {
          changeTaskOrder(activeDragItem.id as string, changeTaskOrderModel).then(res => {
            if (!res?.isSuccess) {
              console.log('Update task order failed')
              setListState(_prev => project?.board?.lists as ListResponseForBoard[])
            } else {
              const dragOverResult: DragOverResult = {
                activeList: targetColumn as ListResponseForBoard,
                overList: targetColumn
              }
              dispatch(projectSlice.actions.changeTaskOrder({ dragOverResult, resData: res.data }))
              // call hub
              if (projectHub.isConnected) {
                // SendEndDragTask
                projectHub.connection?.send(hubs.project.send.endDragTask, res?.data, dragOverResult)
              }
            }
          })
        }
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
          changeListOrder(newListOrder, active.id + '', over.id + '').then(res => {
            if (res?.isSuccess) {
              // cập nhật lại thành công
              const updatedListOrder = res.data
              dispatch(projectSlice.actions.changeListOrder(updatedListOrder))
              if (projectHub.isConnected) {
                // SendEndDragList
                projectHub.connection?.send(hubs.project.send.endDragList, updatedListOrder)
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
  const customMouseSensor = useSensor(MyCustomSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })

  const sensors = useSensors(customMouseSensor, touchSensor)
  return (
    <>
      <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} sensors={sensors}>
        <SortableContext
          disabled={remoteDragging?.isDragging || blockDragState.isDisabled}
          items={listState?.map(l => l?.id) ?? []}
          strategy={horizontalListSortingStrategy}
        >
          <Flex $gap='1.5rem' className='column-list page-slide'>
            {listState?.map(column => (
              <SortableColumn
                blockDragState={blockDragState}
                remoteDragging={remoteDragging}
                key={column.id}
                column={column}
              />
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
