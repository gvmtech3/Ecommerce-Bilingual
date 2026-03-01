// src/api/axiosClient.js
// Drop-in mock for axios — same { data } response shape.
// Handles every route that db.json / json-server used to serve.
// Swap this file for the real axios instance when a backend is ready.

import {
  USERS, PROFILES, CATEGORIES, PRODUCTS,
  ORDERS, ORDER_ITEMS, SERVICE_INQUIRIES, NOTIFICATIONS_DEFAULTS,
} from './mockData'

// ── In-memory working copies (mutations survive for the session) ──────────────
let users             = USERS.map(u => ({ ...u }))
let profiles          = PROFILES.map(p => ({ ...p }))
let categories        = CATEGORIES.map(c => ({ ...c }))
let products          = PRODUCTS.map(p => ({ ...p }))
let orders            = ORDERS.map(o => ({ ...o }))
let orderItems        = ORDER_ITEMS.map(i => ({ ...i }))
let serviceInquiries  = SERVICE_INQUIRIES.map(i => ({ ...i }))
let notifications     = { ...NOTIFICATIONS_DEFAULTS }

// ── Helpers ───────────────────────────────────────────────────────────────────
const ok  = (data) => Promise.resolve({ data })
const err = (msg, status = 400) =>
  Promise.reject({ response: { status, data: { message: msg } } })
const delay = (ms = 150) => new Promise(r => setTimeout(r, ms))
const newId = () => String(Date.now())

// ── Query-string parser: "/resource?key=val&key2=val2" ────────────────────────
function parseUrl(url) {
  const [path, qs] = url.split('?')
  const params = {}
  if (qs) qs.split('&').forEach(p => { const [k,v] = p.split('='); params[k] = v })
  return { path, params }
}

// ── Filter a collection by all params present ─────────────────────────────────
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

    // /users
    if (path === '/users') return ok(hasParams ? filterBy(users, params) : users)

    // /users/:id
    const userM = path.match(/^\/users\/(\w+)$/)
    if (userM) {
      const u = users.find(u => u.id === userM[1])
      return u ? ok(u) : err('User not found', 404)
    }

    // /profiles
    if (path === '/profiles') return ok(hasParams ? filterBy(profiles, params) : profiles)

    // /profiles/:id
    const profileM = path.match(/^\/profiles\/(\w+)$/)
    if (profileM && !path.startsWith('/profiles/notifications')) {
      const p = profiles.find(p => p.id === profileM[1])
      return p ? ok(p) : err('Profile not found', 404)
    }

    // /profiles/notifications/:userId
    if (path.startsWith('/profiles/notifications/')) return ok(notifications)

    // /categories
    if (path === '/categories') return ok(hasParams ? filterBy(categories, params) : categories)

    // /categories/:id
    const catM = path.match(/^\/categories\/(\w+)$/)
    if (catM) {
      const c = categories.find(c => c.id === catM[1])
      return c ? ok(c) : err('Category not found', 404)
    }

    // /products
    if (path === '/products') return ok(hasParams ? filterBy(products, params) : products)

    // /products/:id
    const prodM = path.match(/^\/products\/(\w+)$/)
    if (prodM) {
      const p = products.find(p => p.id === prodM[1])
      return p ? ok(p) : err('Product not found', 404)
    }

    // /orders
    if (path === '/orders') return ok(hasParams ? filterBy(orders, params) : orders)

    // /orders/:id
    const orderM = path.match(/^\/orders\/(\w+)$/)
    if (orderM) {
      const o = orders.find(o => o.id === orderM[1])
      return o ? ok(o) : err('Order not found', 404)
    }

    // /orderItems
    if (path === '/orderItems') return ok(hasParams ? filterBy(orderItems, params) : orderItems)

    // /serviceInquiries
    if (path === '/serviceInquiries') return ok(hasParams ? filterBy(serviceInquiries, params) : serviceInquiries)

    // /serviceInquiries/:id
    const inqM = path.match(/^\/serviceInquiries\/(\w+)$/)
    if (inqM) {
      const i = serviceInquiries.find(i => i.id === inqM[1])
      return i ? ok(i) : err('Inquiry not found', 404)
    }

    // Legacy aliases used by older pages
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
      const rec = {
        id: newId(),
        orderDate: new Date().toISOString(),
        status: 'placed',
        ...data,
      }
      orders.push(rec)
      return ok(rec)
    }

    if (path === '/orderItems') {
      const rec = { id: newId(), ...data }
      orderItems.push(rec)
      return ok(rec)
    }

    if (path === '/serviceInquiries' || path === '/inquiries') {
      const rec = {
        id: newId(),
        createdAt: new Date().toISOString(),
        status: 'pending',
        ...data,
      }
      serviceInquiries.push(rec)
      return ok(rec)
    }

    return err(`Unknown POST: ${url}`, 404)
  },

  // ── PATCH ─────────────────────────────────────────────────────────────────
  async patch(url, data) {
    await delay()
    const { path } = parseUrl(url)

    // /users/:id/password
    if (path.match(/^\/users\/\w+\/password$/)) return ok({ success: true })

    // /users/:id
    const userM = path.match(/^\/users\/(\w+)$/)
    if (userM) {
      const idx = users.findIndex(u => u.id === userM[1])
      if (idx === -1) return err('User not found', 404)
      users[idx] = { ...users[idx], ...data }
      return ok(users[idx])
    }

    // /profiles/:id
    const profileM = path.match(/^\/profiles\/(\w+)$/)
    if (profileM && !path.startsWith('/profiles/notifications')) {
      const idx = profiles.findIndex(p => p.id === profileM[1])
      if (idx === -1) return err('Profile not found', 404)
      profiles[idx] = { ...profiles[idx], ...data }
      return ok(profiles[idx])
    }

    // /profiles/notifications/:userId
    if (path.startsWith('/profiles/notifications/')) {
      notifications = { ...notifications, ...data }
      return ok(notifications)
    }

    // /products/:id
    const prodM = path.match(/^\/products\/(\w+)$/)
    if (prodM) {
      const idx = products.findIndex(p => p.id === prodM[1])
      if (idx === -1) return err('Product not found', 404)
      products[idx] = { ...products[idx], ...data }
      return ok(products[idx])
    }

    // /orders/:id
    const orderM = path.match(/^\/orders\/(\w+)$/)
    if (orderM) {
      const idx = orders.findIndex(o => o.id === orderM[1])
      if (idx === -1) return err('Order not found', 404)
      orders[idx] = { ...orders[idx], ...data }
      return ok(orders[idx])
    }

    // /serviceInquiries/:id
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

    const inqM = path.match(/^\/serviceInquiries\/(\w+)$/)
    if (inqM) { serviceInquiries = serviceInquiries.filter(i => i.id !== inqM[1]); return ok({ success: true }) }

    return err(`Unknown DELETE: ${url}`, 404)
  },
}

export default mockClient