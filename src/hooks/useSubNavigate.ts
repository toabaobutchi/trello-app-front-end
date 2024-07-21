import { useLocation, useNavigate } from 'react-router-dom'

export default function useSubNavigate() {
  const navigate = useNavigate()
  const location = useLocation()

  return [navigate, location] as const
}
