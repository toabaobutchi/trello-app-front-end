import Header from '@comps/Header'
import SideBar from '@comps/SideBar'
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
