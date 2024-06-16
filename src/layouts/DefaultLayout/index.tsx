import Header from '@comps/Header'
import SideBar from '@comps/SideBar'
import { fetchWorkspaces } from '@redux/WorkspaceSlice'
import { AppDispatch, RootState } from '@redux/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const MainContent = styled.div`
  padding: 1rem;
  width: 100%;
`

function DefaultLayout({ children = '' }: { children?: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>()
  const loginInfo = useSelector((state: RootState) => state.login)
  useEffect(() => {
    dispatch(fetchWorkspaces(loginInfo))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      <Header />
      <Container>
        <SideBar />
        <MainContent>{children}</MainContent>
      </Container>
    </>
  )
}

export default DefaultLayout
