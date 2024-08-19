import { useState } from 'react'

export default function useToggle(initState: boolean = false, callback?: (state: boolean) => void) {
  const [state, setState] = useState(initState)
  const toggle = () => {
    setState(prevState => !prevState)
    callback?.(!state)
  }
  return [state, toggle, setState] as const
}
