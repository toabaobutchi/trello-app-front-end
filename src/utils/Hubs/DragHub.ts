import { HubConnection } from '@microsoft/signalr'
import HubBase from './HubBase'

export class DragHub extends HubBase {
  protected static connection?: HubConnection = undefined
  constructor(path?: string) {
    super(path ?? '/dragHub')
  }
  async getConnection() {
    if (!DragHub.connection || DragHub.connection.state.startsWith('Disconnect')) {
      DragHub.connection = await this.connect()
    }
    return DragHub.connection
  }
  async disconnect() {
    if (DragHub.connection) {
      await DragHub.connection.stop()
    }
    DragHub.connection = undefined
  }
}
