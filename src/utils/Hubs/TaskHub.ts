import { HubConnection } from '@microsoft/signalr'
import HubBase from './HubBase'

export class TaskHub extends HubBase<Promise<HubConnection | undefined>> {
  protected static connection?: Promise<HubConnection | undefined> = undefined
  constructor(path?: string) {
    super(path ?? '/taskHub')
  }
  get connection() {
    if (!TaskHub.connection) {
      return this.connect()
    }
    return TaskHub.connection
  }

  get isConnected() {
    return Boolean(TaskHub.connection)
  }

  disconnect() {
    if (this.isConnected) {
      TaskHub.connection
        ?.then(connect => {
          return connect?.stop()
        })
        .then(() => (TaskHub.connection = undefined))
    }
  }
}
