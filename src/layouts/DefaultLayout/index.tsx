import Header from '@comps/Header'
import SideBar from '@comps/SideBar'
import Flex from '@comps/StyledComponents/Flex'
import { fetchWorkspaces } from '@redux/WorkspaceSlice'
import { AppDispatch, RootState } from '@redux/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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

function DefaultLayout({ children = '' }: { children?: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>()
  const loginInfo = useSelector((state: RootState) => state.login)
  useEffect(() => {
    dispatch(fetchWorkspaces(loginInfo))
  }, [])
  return (
    <>
      <Flex $flexDirection='column' style={{ width: '100%', overflow: 'hidden' }}>
        <Header />
        <Container>
          <SideBar />
          <MainContent>{children}</MainContent>
        </Container>
      </Flex>
    </>
  )
}

export default DefaultLayout
