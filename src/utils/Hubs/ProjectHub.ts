import { HubConnection, HubConnectionState } from '@microsoft/signalr'
import HubBase from './HubBase'

export class ProjectHub extends HubBase {
  protected static connection?: HubConnection = undefined
  constructor(path?: string) {
    super(path ?? '/projectHub')
  }
  get connection() {
    if (!ProjectHub.connection) {
      this.connect().then(connection => {
        ProjectHub.connection = connection
      })
    }
    return ProjectHub.connection
  }

  get isConnected() {
    return Boolean(ProjectHub.connection && ProjectHub.connection.state === HubConnectionState.Connected)
  }

  get isConnecting() {
    return Boolean(ProjectHub.connection && ProjectHub.connection.state.includes('Connect'))
  }

  disconnect() {
    if (this.isConnected) {
      ProjectHub.connection?.stop().then(() => (ProjectHub.connection = undefined))
    }
  }
}
