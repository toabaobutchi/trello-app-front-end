import { useMemo } from 'react'

type RestResult<T> = {
  rest: T[]
  hasMore: true
}

type NoMoreRest = {
  hasMore: false
}

type SliceResult<T> = {
  data: T[]
} & (NoMoreRest | RestResult<T>)

export default function useSlice<T>(source: T[], startIndex?: number, endIndex?: number): SliceResult<T> {
  const sliceData = useMemo(() => source.slice(startIndex, endIndex), [JSON.stringify(source), startIndex, endIndex])
  const hasMore = source.length > sliceData.length
  if (hasMore) {
    const rest = source.slice(sliceData.length - 1)
    return {
      data: sliceData,
      rest,
      hasMore: true
    }
  }
  return {
    data: sliceData,
    hasMore
  }
}
