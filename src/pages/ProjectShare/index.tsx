import Button from '@comps/Button'
import './ProjectShare.scss'
import Modal from '@comps/Modal'
import { useState } from 'react'
import Flex from '@comps/StyledComponents/Flex'
import Input from '@comps/Input'
import SelectList from '@comps/SelectList'
import { useNavigate } from 'react-router-dom'
import shareImage from '@assets/share-project.jpg'
import Tab from '@comps/Tab'
import ShareProjectByOtherProject from './ShareProjectByOtherProject'
import { inviteToProjectByEmail } from '@services/project.services'
import { InputChange } from '@utils/types'
import { ProjectPageParams } from '@utils/types/page-params.type'
import { usePageParams } from '@hooks/usePageParams'

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

type InvitationType = {
  email: string
  permission: string
}
function ProjectShare() {
  const [shareActiveTab, setShareActiveTab] = useState(initActiveTab)
  const [invitation, setInvitation] = useState<InvitationType>({
    email: '',
    permission: 'member'
  })
  const navigate = useNavigate()
  const params = usePageParams<ProjectPageParams>()

  const handleShareProject = async () => {
    const { email, permission } = invitation
    if (!email || !permission) return
    const res = await inviteToProjectByEmail(params.projectId, invitation)
    if (res?.isSuccess) {
      setInvitation({ email: '', permission: 'member' })
      handleClose()
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
    navigate(-1)
  }
  return (
    <>
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
