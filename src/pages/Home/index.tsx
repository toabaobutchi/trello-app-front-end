import Header from '@comps/Header'
import SideBar from '@comps/SideBar'

function Home() {
  return (
    <>
      <Header />
      <div
        className='row jcsb'
        style={{
          flex: 1,
          width: '100%',
        }}
      >
        <SideBar />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus ullam odit esse pariatur sunt totam, rerum ea
          dolore quas? Nisi aut voluptatibus expedita quisquam voluptatum excepturi esse, quam explicabo rem!
        </p>
      </div>
    </>
  )
}

export default Home
