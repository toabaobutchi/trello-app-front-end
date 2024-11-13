import { useSearchParams } from 'react-router-dom'

type QueryStringHandler = {
  set: (key: string, value: string) => void
  append: (key: string, value: string) => void
  remove: (key: string) => void
}

export default function useQueryString() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchParamsObject = Object.fromEntries(searchParams)
  const handler: QueryStringHandler = {
    set: (key: string, value: string) => {
      const newQueryString = new URLSearchParams()
      newQueryString.set(key, value)
      setSearchParams(newQueryString)
    },
    append: (key: string, value: string) => {
      const currentSearchParams = new URLSearchParams(searchParams)
      if (currentSearchParams.has(key)) {
        currentSearchParams.delete(key)
      }
      currentSearchParams.append(key, value)
      setSearchParams(currentSearchParams)
    },
    remove: (key: string) => {
      const currentSearchParams = new URLSearchParams(searchParams)
      currentSearchParams.delete(key)
      setSearchParams(currentSearchParams)
    }
  }
  return [searchParamsObject, handler] as const
}
