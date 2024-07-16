import { HubConnection, HubConnectionState } from '@microsoft/signalr'
import HubBase from './HubBase'

export class DragHub extends HubBase {
  protected static connection?: HubConnection = undefined
  constructor(path?: string) {
    super(path ?? '/dragHub')
  }
  get connection() {
    if (!this.isConnected) {
      this.connect().then(connection => {
        DragHub.connection = connection
      })
    }
    return DragHub.connection
  }
  get isConnected() {
    return DragHub.connection && DragHub.connection.state.startsWith('Connect')
  }
  disconnect() {
    if (DragHub.connection) {
      DragHub.connection.stop().then(() => (DragHub.connection = undefined))
    }
  }
}
