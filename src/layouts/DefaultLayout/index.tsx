import Header from "@comps/Header";
import SideBar from "@comps/SideBar";

function DefaultLayout({children = ''}: {children?: React.ReactNode}) {
  return <>
      <Header />
        <div
          style={{
            display: 'grid',
            width: '100%',
            gridTemplateColumns: 'minmax(300px, 1fr) 5fr',
            height: '100%'
          }}
        >
          <SideBar />
          <div className="main">{children}</div>
        </div>
  </>
}

export default DefaultLayout;