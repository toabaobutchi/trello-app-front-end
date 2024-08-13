/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@confs/app.config'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { refreshToken } from '@services/auth.services'
import { AccountType, AuthResponse } from '@utils/types'

interface RefreshTokenResponse {
  access_token: string
}

interface FailedQueueItem {
  resolve: (token: string) => void
  reject: (error: AxiosError) => void
}

class HttpClientAuth {
  axios: AxiosInstance
  static accessToken?: string
  static account?: AccountType
  protected static isRefreshing: boolean
  protected static failedQueue: FailedQueueItem[]
  constructor() {
    this.axios = axios.create({
      baseURL: `${config.baseUrl}/api`,
      timeout: config.apiTimeout,
      withCredentials: true
    })

    // khởi tạo access token - trường hợp refresh page
    const accessToken = localStorage.getItem('access_token') ?? ''
    this.axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken

    HttpClientAuth.isRefreshing = false
    HttpClientAuth.failedQueue = []

    this.axios.interceptors.request.use(config => {
      const accessToken = localStorage.getItem('access_token')
      if (accessToken) {
        config.headers = config.headers || {}
        config.headers['Authorization'] = `Bearer ${accessToken}`
      }
      return config
    })

    this.axios.interceptors.response.use(
      response => {
        return response
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (HttpClientAuth.isRefreshing) {
            return new Promise<string>((resolve, reject) => {
              HttpClientAuth.failedQueue.push({ resolve, reject })
            })
              .then(token => {
                originalRequest.headers = originalRequest.headers || {}
                originalRequest.headers.Authorization = `Bearer ${token}`
                return this.axios(originalRequest)
              })
              .catch(err => {
                return Promise.reject(err)
              })
          }

          originalRequest._retry = true
          HttpClientAuth.isRefreshing = true

          return new Promise<AxiosResponse<RefreshTokenResponse>>((resolve, reject) => {
            refreshToken()
              .then(res => {
                if (res && res.status === 200) {
                  const data = res.data as AuthResponse
                  this.setLoginData(data)
                  this.axios.defaults.headers['Authorization'] = `Bearer ${data.accessToken}`
                  originalRequest.headers = originalRequest.headers || {}
                  originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`
                  this.processQueue(null, data.accessToken)
                  resolve(this.axios(originalRequest))
                }
              })
              .catch(err => {
                this.processQueue(err, null)
                reject(err)
              })
              .finally(() => {
                HttpClientAuth.isRefreshing = false
              })
          })
        }
        return Promise.reject(error)
      }
    )
  }

  processQueue(error: AxiosError | null, token: string | null = null) {
    HttpClientAuth.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error)
      } else {
        prom.resolve(token!)
      }
    })
    HttpClientAuth.failedQueue = []
  }

  setLoginData(res: AuthResponse) {
    localStorage.setItem('access_token', res.accessToken)
    HttpClientAuth.account = res.user
    localStorage.setItem('account', btoa(JSON.stringify(res.user)))
  }

  isSuccessResponse(response: AxiosResponse) {
    if (response.status === 200 && response.data.status >= 200 && response.data.status <= 308) {
      return true
    } else return false
  }

  protected getResponse<T = any>(response: AxiosResponse) {
    if (this.isSuccessResponse(response)) {
      return {
        isSuccess: true,
        data: response.data.data as T,
        status: response.data.status,
        message: response.data.message
      } as SuccessResponse<T>
    } else {
      return {
        isSuccess: false,
        data: response.data.data || null,
        status: response.data.status,
        message: response.data.message
      } as ErrorResponse
    }
  }

  protected validateUrl(url: string) {
    if (!url.startsWith('/')) {
      url = `/${url}`
    }
    return url.startsWith('/') ? url : `/${url}`
  }

  protected logError(error: unknown) {
    if (config.env === 'Development') {
      console.log(error)
    }
  }

  async get<T = any>(url: string, options: AxiosRequestConfig<object> = {}) {
    try {
      url = this.validateUrl(url)
      const response = await this.axios.get(url, options)
      const httpResponse = this.getResponse<T>(response)
      return httpResponse
    } catch (err) {
      this.logError(err)
      return null
    }
  }

  async post<TRequest = object, TReponse = any>(
    url: string,
    data?: TRequest,
    options: AxiosRequestConfig<TRequest> = {}
  ) {
    try {
      url = this.validateUrl(url)
      const response = await this.axios.post(url, data, options)
      const httpResponse = this.getResponse<TReponse>(response)
      return httpResponse
    } catch (err) {
      this.logError(err)
      return null
    }
  }

  async postWithoutData<TReponse = any>(url: string, options: AxiosRequestConfig<object> = {}) {
    try {
      const httpResponse = await this.post<object, TReponse>(url, {}, options)
      return httpResponse
    } catch (err) {
      this.logError(err)
      return null
    }
  }

  async put<TRequest = object, TReponse = any>(
    url: string,
    data: TRequest,
    options: AxiosRequestConfig<TRequest> = {}
  ) {
    try {
      url = this.validateUrl(url)
      const response = await this.axios.put(url, data, options)
      const httpResponse = this.getResponse<TReponse>(response)
      return httpResponse
    } catch (err) {
      this.logError(err)
      return null
    }
  }

  async putWithoutData<TReponse = any>(url: string, options: AxiosRequestConfig<object> = {}) {
    try {
      const httpResponse = await this.put<object, TReponse>(url, {}, options)
      return httpResponse
    } catch (err) {
      this.logError(err)
      return null
    }
  }
  async delete<TResponse = any>(url: string, options: AxiosRequestConfig<object> = {}) {
    try {
      const response = await this.axios.delete(url, options)
      const httpResponse = this.getResponse<TResponse>(response)
      return httpResponse
    } catch (err) {
      this.logError(err)
      return null
    }
  }
}

export type Response = {
  status: number
  message: string
}

export type SuccessResponse<T = any> = {
  isSuccess: true
  data: T
} & Response

export type ErrorResponse = {
  isSuccess: false
  data?: any
} & Response

export type HttpResponse<T = any> = ErrorResponse | SuccessResponse<T> | null

export const http = new HttpClientAuth()

export default HttpClientAuth
