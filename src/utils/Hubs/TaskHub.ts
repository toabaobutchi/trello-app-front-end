import { HubConnection, HubConnectionState } from '@microsoft/signalr'
import HubBase from './HubBase'
import { hubs } from './hubs'

export class TaskHub extends HubBase {
  protected static connection?: HubConnection = undefined
  protected taskId?: string
  constructor(taskId?: string, path?: string) {
    super(path || '/taskHub')
    this.taskId = taskId
  }
  get connection() {
    console.log('get connection')
    if (!TaskHub.connection) {
      this.connect().then(connection => {
        connection
          ?.invoke(hubs.taskDetail.send.subscribeTaskGroup, this.taskId)
          .then(_ => {
            TaskHub.connection = connection
          })
          .catch(_ => {})
      })
    }
    console.log('Connection: ', TaskHub.connection)
    return TaskHub.connection
  }

  get isConnected() {
    return Boolean(TaskHub.connection && TaskHub.connection.state === HubConnectionState.Connected)
  }

  disconnect() {
    if (this.isConnected) {
      TaskHub.connection?.stop().then(() => (TaskHub.connection = undefined))
    }
  }
}
