import { HttpResponse } from '@utils/Axios/HttpClientAuth'
import { ChangeLogResponse } from '@utils/types'
import { useEffect, useState } from 'react'
import { Outlet, useLoaderData } from 'react-router-dom'
import ChangeLogItem from './ChangeLogItem'
import './ChangeLog.scss'
import ChangeLogFilters from './ChangeLogFilters'
import Flex from '@comps/StyledComponents'
import { hubs, ProjectHub } from '@utils/Hubs'

function ChangeLog() {
  const loaderData = useLoaderData() as HttpResponse<ChangeLogResponse[]>
  const firstPageChangeLogs = loaderData?.isSuccess ? loaderData.data : ([] as ChangeLogResponse[])
  const [changeLogs, setChangeLogs] = useState<ChangeLogResponse[]>([])
  const [projectHub] = useState(new ProjectHub())

  useEffect(() => {
    setChangeLogs(firstPageChangeLogs)
  }, [JSON.stringify(loaderData)])

  useEffect(() => {
    if (projectHub.isConnected) {
      console.log('Listen', projectHub.connection)
      projectHub.connection?.on(hubs.project.receive.changeLog, (changeLog: ChangeLogResponse) => {
        console.log('Change log', changeLog)
        setChangeLogs(prev => [changeLog, ...prev])
      })
    }
  }, [projectHub.isConnected, projectHub.connection])

  return (
    <>
      <Flex $alignItem='center' $flexDirection='column' className='w-full change-logs'>
        <p className='change-log-header page-header bold'>Change logs</p>
        <ChangeLogFilters />
        <div className='change-logs-container'>
          {changeLogs.slice(0, 20).map(log => (
            <ChangeLogItem key={log.id} changeLog={log} />
          ))}
          {changeLogs.length <= 0 && <p className='text-warning'>No change log</p>}
        </div>
      </Flex>
      <Outlet />
    </>
  )
}

export default ChangeLog
