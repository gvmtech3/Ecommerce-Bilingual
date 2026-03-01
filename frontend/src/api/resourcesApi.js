// src/api/resourcesApi.js
// Typed helpers for every db.json collection.
// Import and use these in pages instead of calling axiosClient directly.

import axiosClient from './axiosClient'

// ── Categories ────────────────────────────────────────────────────────────────
export const categoriesApi = {
  getAll:   ()   => axiosClient.get('/categories'),
  getById:  (id) => axiosClient.get(`/categories/${id}`),
}

// ── Products ──────────────────────────────────────────────────────────────────
export const productsApi = {
  getAll:          ()           => axiosClient.get('/products'),
  getById:         (id)         => axiosClient.get(`/products/${id}`),
  getByCategory:   (categoryId) => axiosClient.get(`/products?categoryId=${categoryId}`),
  update:          (id, data)   => axiosClient.patch(`/products/${id}`, data),
}

// ── Orders ────────────────────────────────────────────────────────────────────
export const ordersApi = {
  getAll:       ()       => axiosClient.get('/orders'),
  getByUser:    (userId) => axiosClient.get(`/orders?userId=${userId}`),
  getById:      (id)     => axiosClient.get(`/orders/${id}`),
  create:       (data)   => axiosClient.post('/orders', data),
  updateStatus: (id, status) => axiosClient.patch(`/orders/${id}`, { status }),
}

// ── Order Items ───────────────────────────────────────────────────────────────
export const orderItemsApi = {
  getByOrder: (orderId) => axiosClient.get(`/orderItems?orderId=${orderId}`),
  create:     (data)    => axiosClient.post('/orderItems', data),
}

// ── Service Inquiries ─────────────────────────────────────────────────────────
export const inquiriesApi = {
  getAll:    ()       => axiosClient.get('/serviceInquiries'),
  getByUser: (userId) => axiosClient.get(`/serviceInquiries?userId=${userId}`),
  getById:   (id)     => axiosClient.get(`/serviceInquiries/${id}`),
  create:    (data)   => axiosClient.post('/serviceInquiries', data),
  update:    (id, data) => axiosClient.patch(`/serviceInquiries/${id}`, data),
  delete:    (id)     => axiosClient.delete(`/serviceInquiries/${id}`),
}

// ── Profiles ──────────────────────────────────────────────────────────────────
export const profilesApi = {
  getByUser:  (userId) => axiosClient.get(`/profiles?userId=${userId}`),
  getById:    (id)     => axiosClient.get(`/profiles/${id}`),
  create:     (data)   => axiosClient.post('/profiles', data),
  update:     (id, data) => axiosClient.patch(`/profiles/${id}`, data),
  getNotifications:    (userId) => axiosClient.get(`/profiles/notifications/${userId}`),
  saveNotifications:   (userId, data) => axiosClient.patch(`/profiles/notifications/${userId}`, data),
}