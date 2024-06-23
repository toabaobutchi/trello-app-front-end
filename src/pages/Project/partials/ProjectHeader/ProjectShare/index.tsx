import Button from '@comps/Button'
import './ProjectShare.scss'
import Modal from '@comps/Modal'
import { useState } from 'react'
import Flex from '@comps/StyledComponents/Flex'
import Input from '@comps/Input'
import SelectList from '@comps/SelectList'
import ButtonGroup from '@comps/ButtonGroup'

const roles = [
  { value: 'admin', display: 'Admin' },
  { value: 'member', display: 'Member' },
  { value: 'observer', display: 'Observer' }
]

function ProjectShare() {
  const [modalOpen, setModalOpen] = useState(false)
  const handleToggleModal = () => setModalOpen(!modalOpen)
  return (
    <>
      <Button onClick={handleToggleModal} variant='filled'>
        <i className='fa-solid fa-share-nodes'></i> Share
      </Button>
      <Modal
        style={{ width: '35%' }}
        onClose={handleToggleModal}
        open={modalOpen}
        layout={{ header: { title: 'Share project', closeIcon: true } }}
      >
        <Flex $alignItem='center' $gap='0.5rem' style={{ width: '100%' }}>
          <Input.TextBox
            inputSize='small'
            label={{ content: 'Email address' }}
            sameLine
            style={{ flex: 1 }}
            type='email'
            className='input-focus-shadow'
            id='invited-email-input'
          />
          <SelectList size='small' items={roles} selectedValue='member' />
          <Button variant='filled'>Share</Button>
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
      </Modal>
    </>
  )
}

export default ProjectShare
