// import config from '@confs/app.config'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

/**@deprecated Use {@link HttpClientAuth} instead*/
class HttpClient {
  axios: AxiosInstance
  // static accessToken?: string
  constructor() {
    this.axios = axios.create({
      baseURL: 'https://localhost:7207/api',
      timeout: 30 * 1000,
      withCredentials: true
    })
  }
  // setAccessToken(accessToken: string) {
  //   HttpClient.accessToken = accessToken
  //   this.axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
  // }
  async get(url: string, options: object = {}) {
    try {
      const response = await this.axios.get(url, options)
      return { data: response.data.data, status: response.data.status, message: response.data.message }
    } catch (err) {
      console.log(err)
      return null
    }
  }

  // protected getResponse<T = any>(response: AxiosResponse) {
  //   return {
  //     data: (response.data.data as T) || null,
  //     status: response.data.status,
  //     message: response.data.message
  //   } as HttpResponse<T>
  // }

  // protected validateUrl(url: string) {
  //   if (!url.startsWith('/')) {
  //     url = `/${url}`
  //   }
  //   return url.startsWith('/') ? url : `/${url}`
  // }

  // protected logError(error: unknown) {
  //   if (config.env === 'Development') {
  //     console.log(error)
  //   }
  // }

  // async get_v2<T = any>(url: string, options: AxiosRequestConfig<object> = {}) {
  //   try {
  //     url = this.validateUrl(url)
  //     const response = await this.axios.get(url, options)
  //     const httpResponse = this.getResponse<T>(response)
  //     return httpResponse
  //   } catch (err) {
  //     this.logError(err)
  //     return null
  //   }
  // }

  // async getAuth_v2<T = any>(url: string, options: AxiosRequestConfig<object> = {}) {
  //   try {
  //     url = this.validateUrl(url)
  //     const response = await this.axios.get(url, options)
  //     const httpResponse = this.getResponse<T>(response)
  //     return httpResponse
  //   } catch (err) {
  //     this.logError(err)
  //     return null
  //   }
  // }

  async getAuth(url: string, accessToken: string = '', options: AxiosRequestConfig<object> = {}) {
    try {
      if (!accessToken) accessToken = localStorage.getItem('access_token') ?? ''
      const response = await this.axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}`, ...options.headers },
        ...options
      })
      return { data: response.data.data, status: response.data.status, message: response.data.message }
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async post(url: string, data: object = {}, options: AxiosRequestConfig<object> = {}) {
    try {
      const response = await this.axios.post(url, data, options)
      return { data: response.data.data, status: response.data.status, message: response.data.message }
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async postAuth(url: string, data: object, accessToken: string = '', options: AxiosRequestConfig<object> = {}) {
    try {
      if (!accessToken) accessToken = localStorage.getItem('access_token') ?? ''
      const response = await this.axios.post(url, data, {
        headers: { Authorization: `Bearer ${accessToken}`, ...options.headers },
        ...options
      })
      return { data: response.data.data, status: response.data.status, message: response.data.message }
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async put(url: string, data: object = {}, options: object = {}) {
    try {
      const response = await this.axios.put(url, data, options)
      return { data: response.data, status: response.status }
    } catch (err) {
      console.log(err)
      return null
    }
  }
  async putAuth(url: string, data: object = {}, accessToken: string = '', options: AxiosRequestConfig<object> = {}) {
    try {
      if (!accessToken) accessToken = localStorage.getItem('access_token') ?? ''
      const response = await this.axios.put(url, data, {
        headers: { Authorization: `Bearer ${accessToken}`, ...options.headers },
        ...options
      })
      return { data: response.data.data, status: response.data.status, message: response.data.message }
    } catch (err) {
      console.log(err)
      return null
    }
  }
  async deleteAuth(url: string, accessToken: string = '', options: AxiosRequestConfig<object> = {}) {
    try {
      if (!accessToken) accessToken = localStorage.getItem('access_token') ?? ''
      const response = await this.axios.delete(url, {
        headers: { Authorization: `Bearer ${accessToken}`, ...options.headers },
        ...options
      })
      return { data: response.data.data, status: response.data.status, message: response.data.message }
    } catch (err) {
      console.log(err)
      return null
    }
  }

  // async delete(url: string, data: object = {}, options: object = {}) {
  //   try {
  //     const response = await this.axios.delete(url, data, options)
  //     return { data: response.data.data, status: response.status }
  //   } catch (err) {
  // console.log(err)
  //     console.table(err) // log error
  //     return null
  //   }
  // }
}
// export type HttpResponse<T = any> = {
//   status: number
//   data: T | null
//   message: string
// }
export default HttpClient
