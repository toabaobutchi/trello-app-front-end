export type RegisterHub = {
  [hubKey: string]: {
    send: {
      [sendEventKey: string]: string
    }
    receive?: {
      [receiveEventKey: string]: string
    }
  }
}

export const hubs = {
  project: {
    send: {
      startDragList: 'SendStartDragList',
      startDragTask: 'SendStartDragTask',
      endDragList: 'SendEndDragList',
      endDragTask: 'SendEndDragTask',
      startUpdateTaskInfo: 'SendStartUpdateTaskInfo',
      cancelUpdateTaskInfo: 'SendCancelUpdateTaskInfo',
      updateTaskInfo: 'SendUpdateTaskInfo',
      checkSubtask: 'SendCheckSubtask',
      changeSubtaskName: 'SendChangeSubtaskName',
      addingSubtasks: 'SendAddingSubtasks',
      finishAddSubtasks: 'SendFinishAddSubtasks',
      addSubtaskResult: 'SendAddSubtaskResult',
      deleteSubtask: 'SendDeleteSubtask',
      addNewTask: 'SendAddNewTask'
    },
    receive: {
      startDragList: 'ReceiveStartDragList',
      startDragTask: 'ReceiveStartDragTask',
      endDragList: 'ReceiveEndDragList',
      endDragTask: 'ReceiveEndDragTask',
      startUpdateTaskInfo: 'ReceiveStartUpdateTaskInfo',
      cancelUpdateTaskInfo: 'ReceiveCancelUpdateTaskInfo',
      updateTaskInfo: 'ReceiveUpdateTaskInfo',
      checkSubtask: 'ReceiveCheckSubtask',
      changeSubtaskName: 'ReceiveChangeSubtaskName',
      addingSubtasks: 'ReceiveAddingSubtasks',
      finishAddSubtasks: 'ReceiveFinishAddSubtasks',
      addSubtaskResult: 'ReceiveAddSubtaskResult',
      deleteSubtask: 'ReceiveDeleteSubtask',
      addNewTask: 'ReceiveAddNewTask'
    }
  },
  taskDetail: {
    send: {
      subscribeTaskGroup: 'SubscribeTaskGroup',
      comment: 'SendComment'
    },
    receive: {
      subscribeTaskGroup: 'RecieveSubscriber',
      comment: 'RecieveComment'
    }
  }
}
