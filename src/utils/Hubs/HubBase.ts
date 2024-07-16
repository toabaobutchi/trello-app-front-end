import config from '@confs/app.config'
import { HubConnectionBuilder } from '@microsoft/signalr'

export default class HubBase {
  baseUrl: string
  constructor(path: string) {
    this.baseUrl = `${config.baseUrl}${path}`
  }
  async connect() {
    try {
      const connection = new HubConnectionBuilder().withUrl(this.baseUrl).withAutomaticReconnect().build()
      await connection.start()
      return connection
    } catch {
      return undefined
    }
  }
}
