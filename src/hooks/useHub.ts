import config from '@confs/app.config'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { useEffect, useState } from 'react'

export function useHub(path: string, subscriber: string, ...args: object[]) {
  const [connection, setConnection] = useState<HubConnection>()
  useEffect(() => {
    const connect = new HubConnectionBuilder().withUrl(`${config.baseUrl}${path}`).build()
    connect
      .start()
      .then(() => {
        setConnection(connect)
        connect.invoke(subscriber, ...args)
      })
      .catch(err => console.log(err))

    return () => {
      connect.stop()
    }
  }, [path, subscriber])
  return connection
}
