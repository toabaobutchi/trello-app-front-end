import { HubConnection } from '@microsoft/signalr'
import HubBase from './HubBase'

export class ProjectHub extends HubBase {
  protected static connection?: HubConnection = undefined
  constructor(path?: string) {
    super(path ?? '/projectHub')
  }
  get connection() {
    if (!this.isConnected) {
      this.connect().then(connection => {
        ProjectHub.connection = connection
      })
    }
    return ProjectHub.connection
  }

  get isConnected() {
    return ProjectHub.connection && ProjectHub.connection.state.startsWith('Connect')
  }

  disconnect() {
    if (ProjectHub.connection) {
      ProjectHub.connection.stop().then(() => (ProjectHub.connection = undefined))
    }
  }
}
