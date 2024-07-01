import { useState } from 'react'
import './MultipleInput.scss'
import { InputChange } from '@utils/types'

type MultipleInputProps = {
  label?: React.ReactNode
  values?: string[]
  value?: string
  keyTriggers?: string[]
  input?: React.ComponentPropsWithRef<'input'>
  valueBoxVariant?: 'filled' | 'outlined'
  onTrigger?: (value: string) => void
  onDelete?: (index: number) => void
}

function MultipleInput({
  label = '',
  values = [],
  value = '',
  keyTriggers = ['Enter'],
  valueBoxVariant = 'filled',
  onTrigger = () => {},
  input = {},
  onDelete = () => {}
}: MultipleInputProps) {
  const [text, setText] = useState(value)
  const handleChangeText = (e: InputChange) => {
    setText(e.target.value)
  }
  const handlePressTriggerKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (keyTriggers.includes(e.key) && text !== '') {
      onTrigger(text)
      setText('')
    }
  }
  return (
    <>
      <label className='multiple-input-label' htmlFor={input?.id}>
        {label}
      </label>
      <label htmlFor={input?.id} className={'multiple-input row gap-1'}>
        {values.map((value, index) => {
          return (
            <div key={index} className={`multiple-input-value ${valueBoxVariant}-value`}>
              <p>{value}</p>
              <button className='multiple-input-value-clear-button' onClick={() => onDelete(index)}>
                <i className='fa-solid fa-xmark'></i>
              </button>
            </div>
          )
        })}
        <input
          {...input}
          onChange={handleChangeText}
          onKeyDown={handlePressTriggerKeys}
          placeholder={`Multiple - seperate by ${keyTriggers.join(', ')}`}
          type='text'
          value={text}
        />
      </label>
    </>
  )
}

export default MultipleInput
