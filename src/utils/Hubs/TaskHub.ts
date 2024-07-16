import { HubConnection } from '@microsoft/signalr'
import HubBase from './HubBase'

export class TaskHub extends HubBase {
  protected static connection?: HubConnection = undefined
  constructor(path?: string) {
    super(path ?? '/taskHub')
  }
  get connection() {
    if (!this.isConnected) {
      this.connect().then(connection => {
        TaskHub.connection = connection
      })
    }
    return TaskHub.connection
  }

  get isConnected() {
    // `Connected` và `Connecting` thì trả về true, không cần phải gọi đi kết nối lại
    return TaskHub.connection && TaskHub.connection.state.startsWith('Connect')
  }

  disconnect() {
    if (TaskHub.connection) {
      TaskHub.connection.stop().then(() => (TaskHub.connection = undefined))
    }
  }
}
