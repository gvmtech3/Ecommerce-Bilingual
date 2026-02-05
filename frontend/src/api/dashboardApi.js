// src/api/dashboardApi.js
import axiosClient from './axiosClient'

const dashboardApi = {
  // Orders + orderItems for a customer
  getCustomerOverview(userId) {
    return axiosClient.get(`/orders`, {
      params: {
        userId,
        _embed: 'orderItems',
      },
    })
  },

  // Service inquiries for a brand
  getBrandOverview(userId) {
    return axiosClient.get('/serviceInquiries', {
      params: {
        userId,
      },
    })
  },
}

export default dashboardApi
