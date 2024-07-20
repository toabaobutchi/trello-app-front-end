import Button from '@comps/Button'
import './ProjectShare.scss'
import Modal from '@comps/Modal'
import { useState } from 'react'
import Flex from '@comps/StyledComponents/Flex'
import Input from '@comps/Input'
import SelectList from '@comps/SelectList'
import ButtonGroup from '@comps/ButtonGroup'
import HttpClient from '@utils/HttpClient'
import { useNavigate, useParams } from 'react-router-dom'
import { InputChange, ProjectPageParams } from '@utils/types'
import { HttpStatusCode } from 'axios'
import shareImage from '@assets/share-project.jpg'
import Tab from '@comps/Tab'
import ShareProjectByOtherProject from './ShareProjectByOtherProject'

const roles = [
  { value: 'admin', display: 'Admin' },
  { value: 'member', display: 'Member' },
  { value: 'observer', display: 'Observer' }
]

const tabs = [
  {
    value: 'share-by-email',
    display: 'Share by Email'
  },
  {
    value: 'share-by-friend',
    display: 'Someone you know'
  }
]

const initActiveTab = 'share-by-email'

const http = new HttpClient()
type InvitationType = {
  email: string
  permission: string
}
function ProjectShare() {
  // const [modalOpen, setModalOpen] = useState(false)
  const [shareActiveTab, setShareActiveTab] = useState(initActiveTab)
  // const handleToggleModal = () => setModalOpen(!modalOpen)
  const [invitation, setInvitation] = useState<InvitationType>({
    email: '',
    permission: 'member'
  })
  const navigate = useNavigate()
  const params = useParams() as ProjectPageParams

  const handleShareProject = async () => {
    const { email, permission } = invitation
    if (!email || !permission) return
    const res = await http.postAuth(`/projects/${params.projectId}/invite`, invitation)
    if (res?.status === HttpStatusCode.Ok) {
      // setModalOpen(false)
      setInvitation({ email: '', permission: 'member' })
    }
  }
  const handleChangeEmail = (e: InputChange) => {
    setInvitation({ ...invitation, email: e.target.value })
  }
  const handleSelectPermission = ({ value }: { value: string }) => {
    setInvitation({ ...invitation, permission: value })
  }
  const handleTabChange = (tab: string) => {
    setShareActiveTab(tab)
  }
  const handleClose = () => {
    navigate('..')
  }
  return (
    <>
      {/* <Button onClick={handleToggleModal} variant='filled'>
        <i className='fa-solid fa-share-nodes'></i> Share
      </Button> */}
      <Modal
        style={{ width: '35%' }}
        onClose={handleClose}
        open
        layout={{ header: { title: 'Share project', closeIcon: true } }}
      >
        <Tab tabs={tabs} activeTab={shareActiveTab} onTabClick={handleTabChange}>
          <Tab.Content show={shareActiveTab === 'share-by-email'}>
            <Flex $alignItem='center' $justifyContent='center'>
              <img className='share-project-image' src={shareImage} />
            </Flex>
            <Flex $alignItem='center' $gap='0.5rem' style={{ width: '100%' }}>
              <Input.TextBox
                onChange={handleChangeEmail}
                inputSize='small'
                label={{ content: 'Email address' }}
                sameLine
                style={{ flex: 1 }}
                type='email'
                autoFocus
                className='input-focus-shadow'
                id='invited-email-input'
              />
              <SelectList onChoose={handleSelectPermission} size='small' items={roles} selectedValue='member' />
              <Button onClick={handleShareProject} variant='filled'>
                <i className='fa-solid fa-paper-plane'></i> Share
              </Button>
            </Flex>

            <Flex $alignItem='center' $gap='1rem' className='my-1'>
              <p>Or</p>
              <ButtonGroup
                openAction
                actionButton={
                  <>
                    <SelectList size='small' items={roles} selectedValue='member' />
                  </>
                }
              >
                <Button variant='text' theme='default'>
                  <i className='fa-solid fa-feather'></i> Create a link for
                </Button>
              </ButtonGroup>
            </Flex>
          </Tab.Content>
          <Tab.Content show={shareActiveTab === 'share-by-friend'}>
            <ShareProjectByOtherProject />
          </Tab.Content>
        </Tab>
      </Modal>
    </>
  )
}

export default ProjectShare
