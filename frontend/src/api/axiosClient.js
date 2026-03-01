// src/api/axiosClient.js
// Drop-in mock for axios — same { data } response shape.
// Handles every route that db.json / json-server used to serve.
// Swap this file for the real axios instance when a backend is ready.

import {
  USERS, PROFILES, CATEGORIES, PRODUCTS,
  ORDERS, ORDER_ITEMS, SERVICE_INQUIRIES, REVIEWS,
  NOTIFICATIONS_DEFAULTS,
} from './mockData'

// ── In-memory working copies (mutations survive for the session) ──────────────
let users            = USERS.map(u => ({ ...u }))
let profiles         = PROFILES.map(p => ({ ...p }))
let categories       = CATEGORIES.map(c => ({ ...c }))
let products         = PRODUCTS.map(p => ({ ...p }))
let orders           = ORDERS.map(o => ({ ...o }))
let orderItems       = ORDER_ITEMS.map(i => ({ ...i }))
let serviceInquiries = SERVICE_INQUIRIES.map(i => ({ ...i }))
let reviews          = REVIEWS.map(r => ({ ...r }))
let notifications    = { ...NOTIFICATIONS_DEFAULTS }

// ── Helpers ───────────────────────────────────────────────────────────────────
const ok    = (data)           => Promise.resolve({ data })
const err   = (msg, status=400) => Promise.reject({ response: { status, data: { message: msg } } })
const delay = (ms = 150)       => new Promise(r => setTimeout(r, ms))
const newId = ()               => String(Date.now())

function parseUrl(url) {
  const [path, qs] = url.split('?')
  const params = {}
  if (qs) qs.split('&').forEach(p => { const [k,v] = p.split('='); params[k] = v })
  return { path, params }
}

function filterBy(collection, params) {
  return collection.filter(item =>
    Object.entries(params).every(([k, v]) => String(item[k]) === String(v))
  )
}

// ─────────────────────────────────────────────────────────────────────────────
const mockClient = {

  // ── GET ───────────────────────────────────────────────────────────────────
  async get(url) {
    await delay()
    const { path, params } = parseUrl(url)
    const hasParams = Object.keys(params).length > 0

    if (path === '/users') return ok(hasParams ? filterBy(users, params) : users)
    const userM = path.match(/^\/users\/(\w+)$/)
    if (userM) {
      const u = users.find(u => u.id === userM[1])
      return u ? ok(u) : err('User not found', 404)
    }

    if (path === '/profiles') return ok(hasParams ? filterBy(profiles, params) : profiles)
    const profileM = path.match(/^\/profiles\/(\w+)$/)
    if (profileM && !path.startsWith('/profiles/notifications')) {
      const p = profiles.find(p => p.id === profileM[1])
      return p ? ok(p) : err('Profile not found', 404)
    }
    if (path.startsWith('/profiles/notifications/')) return ok(notifications)

    if (path === '/categories') return ok(hasParams ? filterBy(categories, params) : categories)
    const catM = path.match(/^\/categories\/(\w+)$/)
    if (catM) {
      const c = categories.find(c => c.id === catM[1])
      return c ? ok(c) : err('Category not found', 404)
    }

    if (path === '/products') return ok(hasParams ? filterBy(products, params) : products)
    const prodM = path.match(/^\/products\/(\w+)$/)
    if (prodM) {
      const p = products.find(p => p.id === prodM[1])
      return p ? ok(p) : err('Product not found', 404)
    }

    if (path === '/orders') return ok(hasParams ? filterBy(orders, params) : orders)
    const orderM = path.match(/^\/orders\/(\w+)$/)
    if (orderM) {
      const o = orders.find(o => o.id === orderM[1])
      return o ? ok(o) : err('Order not found', 404)
    }

    if (path === '/orderItems') return ok(hasParams ? filterBy(orderItems, params) : orderItems)

    // ── Reviews ───────────────────────────────────────────────────────────
    // GET /reviews                    → all reviews
    // GET /reviews?productId=X        → reviews for a product
    // GET /reviews?userId=X           → reviews by a user
    // GET /reviews?productId=X&userId=Y → check if user reviewed a product
    if (path === '/reviews') return ok(hasParams ? filterBy(reviews, params) : reviews)
    const reviewM = path.match(/^\/reviews\/(\w+)$/)
    if (reviewM) {
      const r = reviews.find(r => r.id === reviewM[1])
      return r ? ok(r) : err('Review not found', 404)
    }

    if (path === '/serviceInquiries') return ok(hasParams ? filterBy(serviceInquiries, params) : serviceInquiries)
    const inqM = path.match(/^\/serviceInquiries\/(\w+)$/)
    if (inqM) {
      const i = serviceInquiries.find(i => i.id === inqM[1])
      return i ? ok(i) : err('Inquiry not found', 404)
    }

    // Legacy aliases
    if (path === '/inquiries') return ok(hasParams ? filterBy(serviceInquiries, params) : serviceInquiries)
    const inqLegM = path.match(/^\/inquiries\/(\w+)$/)
    if (inqLegM) {
      const i = serviceInquiries.find(i => i.id === inqLegM[1])
      return i ? ok(i) : err('Inquiry not found', 404)
    }

    return err(`Unknown GET: ${url}`, 404)
  },

  // ── POST ──────────────────────────────────────────────────────────────────
  async post(url, data) {
    await delay()
    const { path } = parseUrl(url)

    if (path === '/users') {
      if (users.find(u => u.email === data.email)) return err('Email already registered', 409)
      const newUser = { id: newId(), ...data }
      users.push(newUser)
      return ok(newUser)
    }

    if (path === '/profiles') {
      const rec = { id: newId(), ...data }
      profiles.push(rec)
      return ok(rec)
    }

    if (path === '/orders') {
      const rec = { id: newId(), orderDate: new Date().toISOString(), status: 'placed', ...data }
      orders.push(rec)
      return ok(rec)
    }

    if (path === '/orderItems') {
      const rec = { id: newId(), ...data }
      orderItems.push(rec)
      return ok(rec)
    }

    // ── POST /reviews ─────────────────────────────────────────────────────
    if (path === '/reviews') {
      // Prevent duplicate: one review per user per product
      const existing = reviews.find(
        r => String(r.productId) === String(data.productId) &&
             String(r.userId)    === String(data.userId)
      )
      if (existing) return err('You have already reviewed this product.', 409)
      const rec = {
        id:       newId(),
        date:     new Date().toISOString(),
        verified: true,
        ...data,
      }
      reviews.push(rec)
      return ok(rec)
    }

    if (path === '/serviceInquiries' || path === '/inquiries') {
      const rec = { id: newId(), createdAt: new Date().toISOString(), status: 'pending', ...data }
      serviceInquiries.push(rec)
      return ok(rec)
    }

    return err(`Unknown POST: ${url}`, 404)
  },

  // ── PATCH ─────────────────────────────────────────────────────────────────
  async patch(url, data) {
    await delay()
    const { path } = parseUrl(url)

    if (path.match(/^\/users\/\w+\/password$/)) return ok({ success: true })

    const userM = path.match(/^\/users\/(\w+)$/)
    if (userM) {
      const idx = users.findIndex(u => u.id === userM[1])
      if (idx === -1) return err('User not found', 404)
      users[idx] = { ...users[idx], ...data }
      return ok(users[idx])
    }

    const profileM = path.match(/^\/profiles\/(\w+)$/)
    if (profileM && !path.startsWith('/profiles/notifications')) {
      const idx = profiles.findIndex(p => p.id === profileM[1])
      if (idx === -1) return err('Profile not found', 404)
      profiles[idx] = { ...profiles[idx], ...data }
      return ok(profiles[idx])
    }

    if (path.startsWith('/profiles/notifications/')) {
      notifications = { ...notifications, ...data }
      return ok(notifications)
    }

    const prodM = path.match(/^\/products\/(\w+)$/)
    if (prodM) {
      const idx = products.findIndex(p => p.id === prodM[1])
      if (idx === -1) return err('Product not found', 404)
      products[idx] = { ...products[idx], ...data }
      return ok(products[idx])
    }

    const orderM = path.match(/^\/orders\/(\w+)$/)
    if (orderM) {
      const idx = orders.findIndex(o => o.id === orderM[1])
      if (idx === -1) return err('Order not found', 404)
      orders[idx] = { ...orders[idx], ...data }
      return ok(orders[idx])
    }

    // PATCH /reviews/:id
    const reviewM = path.match(/^\/reviews\/(\w+)$/)
    if (reviewM) {
      const idx = reviews.findIndex(r => r.id === reviewM[1])
      if (idx === -1) return err('Review not found', 404)
      reviews[idx] = { ...reviews[idx], ...data }
      return ok(reviews[idx])
    }

    const inqM = path.match(/^\/serviceInquiries\/(\w+)$/)
    if (inqM) {
      const idx = serviceInquiries.findIndex(i => i.id === inqM[1])
      if (idx === -1) return err('Inquiry not found', 404)
      serviceInquiries[idx] = { ...serviceInquiries[idx], ...data }
      return ok(serviceInquiries[idx])
    }

    return err(`Unknown PATCH: ${url}`, 404)
  },

  // ── PUT ───────────────────────────────────────────────────────────────────
  async put(url, data) {
    await delay()
    const { path } = parseUrl(url)

    const userM = path.match(/^\/users\/(\w+)$/)
    if (userM) {
      const idx = users.findIndex(u => u.id === userM[1])
      if (idx === -1) return err('User not found', 404)
      users[idx] = { id: userM[1], ...data }
      return ok(users[idx])
    }

    const prodM = path.match(/^\/products\/(\w+)$/)
    if (prodM) {
      const idx = products.findIndex(p => p.id === prodM[1])
      if (idx === -1) return err('Product not found', 404)
      products[idx] = { id: prodM[1], ...data }
      return ok(products[idx])
    }

    return err(`Unknown PUT: ${url}`, 404)
  },

  // ── DELETE ────────────────────────────────────────────────────────────────
  async delete(url) {
    await delay()
    const { path } = parseUrl(url)

    const userM = path.match(/^\/users\/(\w+)$/)
    if (userM) { users = users.filter(u => u.id !== userM[1]); return ok({ success: true }) }

    const prodM = path.match(/^\/products\/(\w+)$/)
    if (prodM) { products = products.filter(p => p.id !== prodM[1]); return ok({ success: true }) }

    const orderM = path.match(/^\/orders\/(\w+)$/)
    if (orderM) { orders = orders.filter(o => o.id !== orderM[1]); return ok({ success: true }) }

    // DELETE /reviews/:id
    const reviewM = path.match(/^\/reviews\/(\w+)$/)
    if (reviewM) { reviews = reviews.filter(r => r.id !== reviewM[1]); return ok({ success: true }) }

    const inqM = path.match(/^\/serviceInquiries\/(\w+)$/)
    if (inqM) { serviceInquiries = serviceInquiries.filter(i => i.id !== inqM[1]); return ok({ success: true }) }

    return err(`Unknown DELETE: ${url}`, 404)
  },
}

export default mockClient