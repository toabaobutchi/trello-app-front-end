import config from '@confs/app.config'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

class HttpClientAuth {
  axios: AxiosInstance
  static accessToken?: string
  constructor() {
    this.axios = axios.create({
      baseURL: `${config.baseUrl}/api`,
      timeout: config.apiTimeout,
      withCredentials: true
    })
  }
  setAccessToken(accessToken: string) {
    HttpClientAuth.accessToken = accessToken
    this.axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
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
  data: T | null
  message: string
}

export default HttpClientAuth
