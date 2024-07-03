import { useContext, useEffect, useState } from 'react'
import './Attachment.scss'
import { TaskDetailContext } from '@comps/TaskCard'
import emptyAttachmentImage from '@assets/attachment.svg'
import Button from '@comps/Button'
import Flex from '@comps/StyledComponents/Flex'
import { AttachmentResponse } from '@utils/types'
import HttpClient from '@utils/HttpClient'
import AttachmentInput from './AttachmentInput'

const http = new HttpClient()

export type AttachmentInputs = {
  link: string
  displayText?: string
}

function Attachment() {
  const taskDetail = useContext(TaskDetailContext)
  const [attachments, setAttatchments] = useState<AttachmentResponse[]>([])
  const [addingAttachment, setAddingAttachment] = useState<AttachmentInputs>()
  useEffect(() => {
    http.getAuth(`attachments/in-task/${taskDetail?.id}`).then(res => {
      if (res?.status === 200) {
        setAttatchments(res.data)
      }
    })
  }, [taskDetail?.id])
  const handleToggleAddingAttachmentInput = () => {
    setAddingAttachment(addingAttachment ? undefined : { link: '', displayText: '' })
  }
  const handleAddAttachment = (attachment: AttachmentInputs) => {
    // call api
    console.log(attachment)
  }
  return (
    <>
      <div className='attachments-container'>
        {!attachments && (
          <>
            <Flex
              style={{ width: '100%', padding: '0.5rem 0' }}
              $flexDirection='column'
              $alignItem='center'
              $justifyContent='center'
              $gap='0.5rem'
            >
              <img className='empty-attachment-img' src={emptyAttachmentImage} alt='empty attachment image' />
              <p className='text-default' style={{ fontSize: '1.2rem' }}>
                No attachments found
              </p>
            </Flex>
          </>
        )}
        {!addingAttachment && (
          <Button variant='filled' size='large' onClick={handleToggleAddingAttachmentInput}>
            <i className='fa-solid fa-file-circle-plus'></i> Add new attachment
          </Button>
        )}
        {addingAttachment && (
          <>
            <AttachmentInput onCancel={handleToggleAddingAttachmentInput} onAdd={handleAddAttachment} />
          </>
        )}
      </div>
    </>
  )
}

export default Attachment
