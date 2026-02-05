// src/api/usersApi.js
import axiosClient from './axiosClient'

const usersApi = {
  getUsers() {
    return axiosClient.get('/users')
  },
  getUserById(id) {
    return axiosClient.get(`/users/${id}`)
  },
  createUser(data) {
    return axiosClient.post('/users', data)
  },
  updateUser(id, data) {
    return axiosClient.put(`/users/${id}`, data)
  },
  patchUser(id, data) {
    return axiosClient.patch(`/users/${id}`, data)
  },
  deleteUser(id) {
    return axiosClient.delete(`/users/${id}`)
  },
}

export default usersApi
