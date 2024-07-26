/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@confs/app.config'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { refreshToken } from '@services/auth.services'

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
                  const newAccessToken = res.data as string
                  localStorage.setItem('access_token', newAccessToken)
                  this.axios.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`
                  originalRequest.headers = originalRequest.headers || {}
                  originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                  this.processQueue(null, newAccessToken)
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

  setAccessToken(accessToken: string) {
    localStorage.setItem('access_token', accessToken)
  }

  protected getResponse<T = any>(response: AxiosResponse) {
    return {
      data: (response.data.data as T) || null,
      status: response.data.status,
      message: response.data.message
    } as HttpResponse<T>
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
      const httpResponse = await this.post<object, TReponse>(url, {}, options)
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

export type HttpResponse<T = any> = {
  status: number
  data?: T
  message: string
}

export const http = new HttpClientAuth()
