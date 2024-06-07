import { useState } from 'react'
import './SearchInput.scss'

interface SearchInputProps {
  beforeButton?: React.ReactNode
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  attributes?: React.ComponentPropsWithoutRef<'input'>
  style?: React.CSSProperties
}

function SearchInput({
  beforeButton = <i className="fa-solid fa-magnifying-glass"></i>,
  onChange = () => {},
  attributes = {},
  style = {}
}: SearchInputProps) {
  const { value = '', ...otherAttributes } = attributes
  const [text, setText] = useState(value)
  if (otherAttributes.id === undefined) {
    console.warn('`input` has no `id` attribute')
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.currentTarget.value)
    onChange(e)
  }
  return (
    <>
      <div className='search-input'>
        {beforeButton && (
          <label
            htmlFor={otherAttributes.id}
            className='search-input-before-button'
          >
            {beforeButton}
          </label>
        )}
        <input
          value={text}
          {...otherAttributes}
          style={style}
          onChange={handleChange}
        />
      </div>
    </>
  )
}

export default SearchInput
