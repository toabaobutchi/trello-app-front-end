import SideBar from '@layouts/SideBar'
import Flex from '@comps/StyledComponents/Flex'
import { Suspense, useEffect } from 'react'
import { Outlet, useLoaderData } from 'react-router-dom'
import { HttpResponse } from '@utils/Axios/HttpClientAuth'
import { WorkspaceResponse } from '@utils/types'
import Error from '@pages/Error'
import { useDispatch } from 'react-redux'
import { workspaceSlice } from '@redux/WorkspaceSlice'

function DefaultLayout() {
  const loaderData = useLoaderData() as HttpResponse<WorkspaceResponse[]>
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(workspaceSlice.actions.setOwnWorkspaces(loaderData))
  }, [loaderData, dispatch])

  if (!loaderData?.isSuccess) {
    return <Error />
  }

  return (
    <>
      <Flex className='w-full' style={{ minHeight: '100%' }}>
        {/* <Container> */}
        <SideBar />
        <div style={{ padding: '1rem', width: '70%', flex: 1 }}>
          <Suspense>
            <Outlet />
          </Suspense>
        </div>
        {/* </Container> */}
      </Flex>
    </>
  )
}

export default DefaultLayout
