import { Params, useParams } from 'react-router-dom'

export function usePageParams<TParams = Readonly<Params<string>>>() {
  
  return useParams() as TParams
}
