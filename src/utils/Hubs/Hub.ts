import { HubConnection } from '@microsoft/signalr'
import HubBase from './HubBase'

export default class Hub extends HubBase {
  static connection?: HubConnection = undefined
  constructor(path: string) {
    super(path)
  }
  async getConnection() {
    if (!Hub.connection) {
      Hub.connection = await this.connect()
      Hub.connection?.start()
    }
    return Hub.connection
  }
  async disconnect() {
    if (Hub.connection) {
      await Hub.connection.stop()
      Hub.connection = undefined
    }
  }
}
