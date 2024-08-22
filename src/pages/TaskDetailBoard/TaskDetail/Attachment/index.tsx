import { useContext, useEffect, useState } from 'react'
import './Attachment.scss'
import emptyAttachmentImage from '@assets/attachment.svg'
import Button from '@comps/Button'
import Flex from '@comps/StyledComponents/Flex'
import { AttachmentResponse, CreateAttachmentModel } from '@utils/types/attachment.type'
import AttachmentInput from './AttachmentInput'
import Tooltip from '@comps/Tooltip-v2'
import { TaskDetailContext } from '@pages/TaskDetailBoard/context'
import { addAttachment, getAttachmentsInTask } from '@services/attachment.services'
import useAccount from '@hooks/useAccount'
import { useProjectSelector } from '@hooks/useProjectSelector'

export type AttachmentInputs = {
  link: string
  displayText?: string
}

function Attachment() {
  const taskDetail = useContext(TaskDetailContext)?.task
  const { members } = useProjectSelector()
  const account = useAccount()
  const [attachments, setAttatchments] = useState<AttachmentResponse[]>([])
  const [addingAttachment, setAddingAttachment] = useState<AttachmentInputs>()
  useEffect(() => {
    if (taskDetail?.id) {
      getAttachmentsInTask(taskDetail.id).then(res => {
        if (res?.isSuccess) {
          setAttatchments(res.data)
        }
      })
    }
  }, [taskDetail?.id])
  const handleToggleAddingAttachmentInput = () => {
    setAddingAttachment(addingAttachment ? undefined : { link: '', displayText: '' })
  }
  const handleAddAttachment = async (attachment: AttachmentInputs) => {
    const assignment = members?.find(a => a.userId === account.id)
    const model = {
      ...attachment,
      taskId: taskDetail?.id as string,
      assignmentId: assignment?.id as string
    } as CreateAttachmentModel
    const res = await addAttachment(model)
    if (res?.isSuccess) {
      setAttatchments([...attachments, res.data])
      handleToggleAddingAttachmentInput()
    }
  }
  const handleCopyLink = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const link = e.currentTarget.dataset['copy-text'] as string
    e.currentTarget.classList.remove('copied')
    e.currentTarget.classList.add('copied')
    await navigator.clipboard.writeText(link)
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
        {attachments && (
          <Flex className='w-full mb-1' $flexDirection='column' $gap='1rem'>
            {attachments.map(attachment => {
              const creator = members?.find(m => m.id === attachment.assignmentId)
              return (
                <div key={attachment.id} className='attachment-item'>
                  <div className='attachment-item-info'>
                    <Flex $alignItem='center' $justifyContent='space-between' $gap='1rem'>
                      <p className='attachment-item-info-display-text'>{attachment.displayText}</p>
                      <p className='attachment-item-info-creation-time'>
                        <i className='fa-regular fa-calendar-check'></i>{' '}
                        {new Date(attachment.createdAt).toLocaleDateString()}
                      </p>
                    </Flex>
                    <p className='attachment-item-info-link'>{attachment.link}</p>
                    <p className='attachment-item-info-creator'>
                      {!creator ? (
                        <span className='text-light'>[Unknown]</span>
                      ) : (
                        <>
                          <img
                            className='attachment-item-info-creator-avatar'
                            src={creator?.avatar}
                            alt={creator?.email}
                          />{' '}
                          <Tooltip arrow content={creator?.email}>
                            <span>{creator?.displayName}</span>
                          </Tooltip>
                        </>
                      )}
                    </p>
                  </div>
                  <Flex $alignItem='center' $gap='0.5rem' className='attachment-item-buttons'>
                    <Tooltip arrow position='bottom' content={`Access to ${attachment.link}`}>
                      <button>
                        <i className='fa-solid fa-share'></i>
                      </button>
                    </Tooltip>
                    <Tooltip arrow position='bottom' content='Copy link'>
                      <button data-copy-text={attachment.link} onClick={handleCopyLink}>
                        <i className='fa-solid fa-link'></i>
                      </button>
                    </Tooltip>
                    <Tooltip arrow position='bottom' content='Delete'>
                      <button>
                        <i className='fa-regular fa-trash-can'></i>
                      </button>
                    </Tooltip>
                  </Flex>
                </div>
              )
            })}
          </Flex>
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
