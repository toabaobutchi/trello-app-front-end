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
      addNewTask: 'SendAddNewTask',
      comment: 'SendComment',
      addNewList: 'SendAddNewList',
      getOnlineMembers: 'SendGetOnlineMembers',
      deleteList: 'SendDeleteList'
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
      addNewTask: 'ReceiveAddNewTask',
      subscriber: 'ReceiveSubscriber',
      comment: 'RecieveComment',
      addNewList: 'ReceiveAddNewList',
      onlineMembers: 'ReceiveOnlineMembers',
      deleteList: 'ReceiveDeleteList'
    }
  },
  taskDetail: {
    send: {
      subscribeTaskGroup: 'SubscribeTaskGroup'
    },
    receive: {
      subscribeTaskGroup: 'RecieveSubscriber'
    }
  }
}