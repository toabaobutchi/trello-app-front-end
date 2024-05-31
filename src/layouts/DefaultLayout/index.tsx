import Header from '@comps/Header'
import SideBar from '@comps/SideBar'

function DefaultLayout({ children = '' }: { children?: React.ReactNode }) {
  return (
    <>
      <Header />
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%'
        }}
      >
        <SideBar />
        <div className='main'>{children}</div>
      </div>
    </>
  )
}

export default DefaultLayout
