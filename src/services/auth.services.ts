import { http } from '@utils/Axios/HttpClientAuth'
import { AuthResponse } from '@utils/types'

const login = async (credentials: string) => {
  const res = await http.post<{ credentials: string }, AuthResponse>('/auth/login', { credentials })
  if (res?.isSuccess) {
    const { accessToken } = res.data
    http.setAccessToken(accessToken)
  }
  return res
}

const refreshToken = async () => {
  const res = await http.postWithoutData<string>('/auth/refresh')
  return res
}

export { login, refreshToken }