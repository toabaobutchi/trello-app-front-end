import Button from '@comps/Button'
import FloatLabelInput from '@comps/FloatLabelInput'
import Flex from '@comps/StyledComponents/Flex'
import { useState } from 'react'
import { AttachmentInputs } from '..'

type AttachmentInputProps = {
  onCancel?: () => void
  onAdd?: (attachmentInput: AttachmentInputs) => void
}

function AttachmentInput({ onAdd = () => {}, onCancel = () => {} }: AttachmentInputProps) {
  const [attachment, setAttachment] = useState<AttachmentInputs>({
    link: '',
    displayText: ''
  })
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachment({ ...attachment, [e.target.name]: e.target.value })
  }
  const handleAdd = () => {
    if (!attachment.link) {
      return
    }
    onAdd(attachment)
  }
  return (
    <>
      <Flex className='w-full mt-2' $alignItem='center' $justifyContent='center' $flexDirection='column' $gap='0.5rem'>
        <Flex $alignItem='center' $justifyContent='space-between' className='w-full' $gap='1rem'>
          <FloatLabelInput
            label='Paste link here'
            input={{ id: 'link-input', name: 'link', autoFocus: true, value: attachment.link }}
            onChange={handleInputChange}
          />
          <FloatLabelInput
            label='Display text'
            input={{ id: 'display-text-input', name: 'displayText', value: attachment.displayText }}
            onChange={handleInputChange}
          />
        </Flex>
        <Flex $alignItem='center' $gap='1rem' className='w-full'>
          <Button onClick={handleAdd}>
            <i className='fa-solid fa-file-circle-plus'></i> Add
          </Button>
          <Button onClick={onCancel} theme='danger'>
            <i className='fa-solid fa-xmark'></i> Cancel
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

export default AttachmentInput
