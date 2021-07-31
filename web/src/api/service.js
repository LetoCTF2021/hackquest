import axios from 'axios'

axios.defaults.baseURL = axios.defaults.baseURL = process.env.API_URL || 'http://localhost:8081'

axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.put['Content-Type'] = 'application/json'
axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}` || ''

const ApiService = {

  constructor () {
  },

  query(resource, params) {
    axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}` || ''
    return axios.get(resource, params).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`)
    })
  },

  get(resource, slug = '') {
    axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}` || ''
    let p
    if (slug) {
      p = axios.get(`${resource}?${slug}`)
    } else {
      p = axios.get(`${resource}`)
    }
    return p
  },

  patch(resource, params) {
    axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}` || ''
    return axios.patch(`${resource}`, params)
  },

  post(resource, params) {
    axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}` || ''
    return axios.post(`${resource}`, params)
  },

  update(resource, slug, params) {
    axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}` || ''
    return axios.put(`${resource}/${slug}`, params)
  },

  put(resource, params) {
    axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}` || ''
    return axios.put(`${resource}`, params)
  },

  delete(resource, params = []) {
    axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}` || ''
    return axios.delete(resource, params).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`)
    })
  }
}

export default ApiService