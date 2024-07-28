import Header from '@layouts/Header'
import SideBar from '@layouts/SideBar'
import Flex from '@comps/StyledComponents/Flex'
import { fetchWorkspaces } from '@redux/WorkspaceSlice'
import { AppDispatch } from '@redux/store'
import { Suspense, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex: 1;
`

const MainContent = styled.div`
  padding: 1rem;
  width: 70%;
  flex: 1;
`

function DefaultLayout() {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch(fetchWorkspaces())
  }, [dispatch])

  return (
    <>
      <Flex $flexDirection='column' style={{ width: '100%', overflow: 'hidden', height: '100%' }}>
        <Header />
        <Container>
          <SideBar />
          <MainContent>
            <Suspense>
              <Outlet />
            </Suspense>
          </MainContent>
        </Container>
      </Flex>
    </>
  )
}

export default DefaultLayout
