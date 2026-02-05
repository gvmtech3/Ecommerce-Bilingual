// src/api/axiosClient.js
import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://localhost:3001', // change when you move to real backend
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor – attach auth token in future
axiosClient.interceptors.request.use(
  (config) => {
    // Example: read token from localStorage
    const token = localStorage.getItem('linces_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor – handle errors globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: log or show toast
    console.error('API error:', error?.response || error?.message)
    return Promise.reject(error)
  }
)

export default axiosClient
