// src/api/usersApi.js
// Identical interface to before — delegates to mockClient (or real axios later).
import axiosClient from './axiosClient'

const usersApi = {
  getUsers()           { return axiosClient.get('/users') },
  getUserById(id)      { return axiosClient.get(`/users/${id}`) },
  createUser(data)     { return axiosClient.post('/users', data) },
  updateUser(id, data) { return axiosClient.put(`/users/${id}`, data) },
  patchUser(id, data)  { return axiosClient.patch(`/users/${id}`, data) },
  deleteUser(id)       { return axiosClient.delete(`/users/${id}`) },
}

export default usersApi