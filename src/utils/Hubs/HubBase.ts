import config from '@confs/app.config'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'

export default abstract class HubBase<T = HubConnection | undefined> {
  baseUrl: string
  constructor(path: string) {
    this.baseUrl = `${config.baseUrl}${path}`
  }
  async connect() {
    try {
      const connection = new HubConnectionBuilder().withUrl(this.baseUrl).withAutomaticReconnect().build()
      await connection.start()
      return connection
    } catch (err) {
      console.log('HubBase', err)
      return undefined
    }
  }
  abstract get connection(): T
  abstract disconnect(): void
}
