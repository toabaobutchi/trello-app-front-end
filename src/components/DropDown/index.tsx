import useOutClick from '@hooks/useOutClick'
import { createContext, useContext, useRef, useState } from 'react'

interface DropdownProps {
  children?: React.ReactNode
}

type DropdownContextType = {
  close?: boolean
  setClose?: React.Dispatch<React.SetStateAction<boolean>>
}

const DropdownContext = createContext<DropdownContextType | null>({ close: true })

function Dropdown({ children }: DropdownProps) {
  const [close, setClose] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const className = `dropdown ${close ? '' : 'open'}`
  const handleClose = () => {
    setClose(false)
  }

  useOutClick(menuRef.current as Element, handleClose)

  return (
    <>
      <DropdownContext.Provider value={{ close, setClose }}>
        <div ref={menuRef} className={className}>
          {children}
        </div>
      </DropdownContext.Provider>
    </>
  )
}

Dropdown.Menu = function () {}

export default Dropdown
