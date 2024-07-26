import HttpClient from '@utils/HttpClient'
import { AuthResponse } from '@utils/types'

const http = new HttpClient()

const login = async (credentials: string) => {
  const res = await http.post('/auth/login', { credentials })
  if (res?.status === 200) {
    const { accessToken } = res?.data as AuthResponse
    
  }

  return res
}

const refreshToken = async () => {
  const res = await http.post('/auth/refresh')
  return res
}

export { login, refreshToken }
