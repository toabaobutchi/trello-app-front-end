import { HubConnection, HubConnectionState } from '@microsoft/signalr'
import HubBase from './HubBase'
// import { hubs } from './hubs'

export class ProjectHub extends HubBase {
  protected static connection?: HubConnection = undefined
  onlineMembersWhenConnect: string[]
  constructor(path?: string) {
    super(path ?? '/projectHub')
    this.onlineMembersWhenConnect = []
  }
  connectToHub(callback?: () => void) {
    if (this.isConnecting) this.disconnect()
    this.connect().then(connection => {
      ProjectHub.connection = connection
      callback?.()
      console.log('Connection established', ProjectHub.connection)
    })
    return Boolean(ProjectHub.connection)
  }
  get connection() {
    // if (!ProjectHub.connection) {
    //   this.connect().then(connection => {
    //     ProjectHub.connection = connection
    //   })
    // }
    return ProjectHub.connection
  }

  get isConnected() {
    return Boolean(ProjectHub.connection && ProjectHub.connection.state === HubConnectionState.Connected)
  }

  get isConnecting() {
    return Boolean(ProjectHub.connection && ProjectHub.connection.state.toLowerCase().includes('connect'))
  }

  get state() {
    return ProjectHub.connection?.state
  }

  disconnect() {
    if (this.isConnected) {
      ProjectHub.connection?.stop().then(() => (ProjectHub.connection = undefined))
    }
  }
}
