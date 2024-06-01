import DefaultLayout from '@layouts/DefaultLayout'
import YourTasksToDay from './partials/YourTasksToDay'

function Home() {
  return (
    <>
      <DefaultLayout>
        <YourTasksToDay />
      </DefaultLayout>
    </>
  )
}

export default Home
