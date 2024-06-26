import Button from '@comps/Button'
import './ProjectInvitation.scss'
import Flex from '@comps/StyledComponents/Flex'

function ProjectInvitation() {
  return (
    <>
      <div className='project-invitation'>
        <div className='project-invitation-card'>
          <div className='project-invitation-card-header' content='15/08/2010'>
            Project name
          </div>
          <div className='project-invitation-card-body'>
            <div className='project-invitation-card-body-description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
            <div className='project-invitation-card-body-inviter'>
              <p className='text-primary'>Lời mời từ:</p> <strong>Hoài An (ngohoaian13010@gmail.com)</strong>
            </div>
          </div>
          <Flex $alignItem='center' $justifyContent='end' style={{ marginTop: '2rem' }}>
            <Button variant='filled' size='large'>
              <i className='fa-solid fa-check'></i> Accept
            </Button>
          </Flex>
        </div>
      </div>
    </>
  )
}

export default ProjectInvitation
