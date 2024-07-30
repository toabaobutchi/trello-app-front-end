import { HttpResponse } from '@utils/Axios/HttpClientAuth'
import { ChangeLogResponse } from '@utils/types'
import { useEffect, useState } from 'react'
import { Outlet, useLoaderData, useSearchParams } from 'react-router-dom'
import ChangeLogItem from './ChangeLogItem'
import './ChangeLog.scss'
import ChangeLogFilters from './ChangeLogFilters'
import Flex from '@comps/StyledComponents'

function ChangeLog() {
  const loaderData = useLoaderData() as HttpResponse<ChangeLogResponse[]>
  const firstPageChangeLogs = loaderData?.isSuccess ? loaderData.data : ([] as ChangeLogResponse[])
  const [changeLogs, setChangeLogs] = useState<ChangeLogResponse[]>([])
  useEffect(() => {
    setChangeLogs(firstPageChangeLogs)
  }, [JSON.stringify(loaderData)])
  return (
    <>
      <Flex $alignItem='center' $flexDirection='column' className='w-full change-logs'>
        <p className='change-log-header page-header bold'>Change logs</p>
        <ChangeLogFilters />
        <div className='change-logs-container'>
          {changeLogs.map(log => (
            <ChangeLogItem key={log.id} changeLog={log} />
          ))}
          {/* Add pagination or infinite scroll here */}
        </div>
      </Flex>
      <Outlet />
    </>
  )
}

export default ChangeLog
