import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

class HttpClient {
  axios: AxiosInstance
  constructor() {
    this.axios = axios.create({
      baseURL: 'https://localhost:7207/api',
      timeout: 5000
    })
  }
  async get(url: string, options: object = {}) {
    try {
      const response = await this.axios.get(url, options)
      return { data: response.data, status: response.status }
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async post(url: string, data: object = {}, options: AxiosRequestConfig<object> = {}) {
    try {
      const response = await this.axios.post(url, data, options)
      return { data: response.data, status: response.status }
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

  // async delete(url: string, data: object = {}, options: object = {}) {
  //   try {
  //     const response = await this.axios.delete(url, data, options)
  //     return { data: response.data, status: response.status }
  //   } catch (err) {
  // console.log(err)
  //     console.table(err) // log error
  //     return null
  //   }
  // }
}

export default HttpClient
