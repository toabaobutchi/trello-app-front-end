import config from '@confs/app.config'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { useEffect, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useHub(path: string, subscriber: string, ...args: any[]) {
  const [connection, setConnection] = useState<HubConnection>()
  useEffect(() => {
    const connect = new HubConnectionBuilder().withUrl(`${config.baseUrl}${path}`).withAutomaticReconnect().build()
    connect
      .start()
      .then(() => {
        setConnection(connect)
        connect.invoke(subscriber, ...args)
      })
      .catch(err => console.log(err))

    return () => {
      if (connection) connection.stop()
    }
  }, [path, subscriber])
  return connection
}
