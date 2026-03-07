// src/api/mockData.js
// Source of truth for all in-memory data.
// All IDs are strings for consistency across the app.

import image1 from '../assets/images/customer-silk.jpg'
import image2 from '../assets/images/story-silk-detail.jpg'
import image3 from '../assets/images/hero-silk.jpg'
import image4 from '../assets/images/image4.jpg'
import image5 from '../assets/images/image5.jpg'
import image6 from '../assets/images/image6.jpg'
import image7 from '../assets/images/image3.jpg'
import image8 from '../assets/images/brand-atelier.jpg'
import image9 from '../assets/images/auth-atelier.jpg'
import image10 from '../assets/images/about_2.jpg'

export const USERS = [
  { id: '1', email: 'customer@example.com', password: 'demo', role: 'customer', name: 'Clara Silva' },
  { id: '2', email: 'brand@example.com',    password: 'demo', role: 'brand',    name: 'Atelier Aurora' },
]

export const PROFILES = [
  { id: '1', userId: '1', name: 'Clara Silva',    phone: '+34 600 000 001' },
  { id: '2', userId: '2', name: 'Atelier Aurora', phone: '+34 600 000 002', website: '', industry: '', companySize: '' },
]

export const CATEGORIES = [
  { id: '1', name: 'Blouses', nameEs: 'Blusas',    description: 'Silk blouses and tops.' },
  { id: '2', name: 'Dresses', nameEs: 'Vestidos',   description: 'Silk dresses and gowns.' },
  { id: '3', name: 'Scarves', nameEs: 'Pañuelos',   description: 'Silk scarves and wraps.' },
  { id: '4', name: 'Shirts',  nameEs: 'Camisas',    description: 'Silk shirts.' },
  { id: '5', name: 'Robes',   nameEs: 'Batas',      description: 'Silk robes and loungewear.' },
  { id: '6', name: 'Tops',    nameEs: 'Tops',       description: 'Silk tops.' },
  { id: '7', name: 'Pants',   nameEs: 'Pantalones', description: 'Silk trousers and pants.' },
]

export const PRODUCTS = [
  {
    id: '1', categoryId: '1',
    name: 'Silk Wrap Blouse',         nameEs: 'Blusa Cruzada de Seda',
    description: 'Soft wrap blouse in lightweight silk, designed for everyday wear.',
    descriptionEs: 'Blusa cruzada en seda ligera, diseñada para el uso diario.',
    price: 7500, imageUrl: image1,
    stock: 12, tag: 'bestseller',
    images: [image1]
  },
  {
    id: '2', categoryId: '2',
    name: 'Midnight Silk Dress',      nameEs: 'Vestido de Seda Midnight',
    description: 'Bias-cut dress in deep ink silk with subtle shine.',
    descriptionEs: 'Vestido al bies en seda tinta profunda con brillo sutil.',
    price: 12800, imageUrl: image2,
    stock: 5, tag: 'new',
    images: [image2, image8]
  },
  {
    id: '3', categoryId: '3',
    name: 'Handpainted Silk Scarf',   nameEs: 'Pañuelo de Seda Pintado a Mano',
    description: 'Hand-painted 90×90 cm silk twill scarf.',
    descriptionEs: 'Pañuelo de seda twill 90×90 cm pintado a mano.',
    price: 9500, imageUrl: image3,
    stock: 20, tag: 'new',
    images: [image3, image9]
  },
  {
    id: '4', categoryId: '4',
    name: 'Classic Silk Shirt',       nameEs: 'Camisa Clásica de Seda',
    description: 'Timeless silk shirt with mother-of-pearl buttons.',
    descriptionEs: 'Camisa de seda atemporal con botones de nácar.',
    price: 16500, imageUrl: image4,
    stock: 8, tag: 'bestseller',
    images: [image4, image10, image1, image2]
  },
  {
    id: '5', categoryId: '5',
    name: 'Silk Lounge Robe',         nameEs: 'Bata de Seda Loungewear',
    description: 'Relaxed kimono-style robe in pure charmeuse silk.',
    descriptionEs: 'Bata estilo kimono en seda charmeuse pura.',
    price: 24500, imageUrl: image5,
    stock: 6, tag: 'trending',
    images: [image5]
  },
  {
    id: '6', categoryId: '6',
    name: 'Structured Silk Top',      nameEs: 'Top Estructurado de Seda',
    description: 'Sleeveless structured top with invisible side zip.',
    descriptionEs: 'Top sin mangas estructurado con cremallera lateral invisible.',
    price: 13500, imageUrl: image6,
    stock: 14, tag: 'trending',
    images: [image6]
  },
  {
    id: '7', categoryId: '7',
    name: 'Wide-Leg Silk Trousers',   nameEs: 'Pantalón de Seda Palazzo',
    description: 'Fluid wide-leg trousers in ivory silk.',
    descriptionEs: 'Pantalón palazzo fluido en seda marfil.',
    price: 21000, imageUrl: image7,
    stock: 9, tag: 'new',
    images: [image7]
  },
  {
    id: '8', categoryId: '2',
    name: 'Draped Silk Evening Gown', nameEs: 'Vestido de Noche en Seda',
    description: 'Floor-length draped gown with cowl neckline.',
    descriptionEs: 'Vestido largo drapeado con escote vaca.',
    price: 42000, imageUrl: image8,
    stock: 0, tag: 'bestseller',
    images: [image8, image2]
  },
  {
    id: '9', categoryId: '3',
    name: 'Draped Silk Evening Gown', nameEs: 'Vestido de Noche en Seda',
    description: 'Floor-length draped gown with cowl neckline.',
    descriptionEs: 'Vestido largo drapeado con escote vaca.',
    price: 52000, imageUrl: image9,
    stock: 5, tag: 'bestseller',
    images: [image9, image3]
  },
  {
    id: '10', categoryId: '4',
    name: 'Draped Silk Evening Gown', nameEs: 'Vestido de Noche en Seda',
    description: 'Floor-length draped gown with cowl neckline.',
    descriptionEs: 'Vestido largo drapeado con escote vaca.',
    price: 36000, imageUrl: image10,
    stock: 10, tag: 'bestseller',
    images: [image10, image4, image1, image2]
  },
  {
    id: '11', categoryId: '4',
    name: 'Draped Silk Evening Gown', nameEs: 'Vestido de Noche en Seda',
    description: 'Floor-length draped gown with cowl neckline.',
    descriptionEs: 'Vestido largo drapeado con escote vaca.',
    price: 9000, imageUrl: image1,
    stock: 6, tag: 'bestseller',
    images: [image1, image10, image4, image2]
  },
  {
    id: '12', categoryId: '4',
    name: 'Draped Silk Evening Gown', nameEs: 'Vestido de Noche en Seda',
    description: 'Floor-length draped gown with cowl neckline.',
    descriptionEs: 'Vestido largo drapeado con escote vaca.',
    price: 75000, imageUrl: image2,
    stock: 0, tag: 'bestseller',
    images: [image2, image10, image4, image1]
  },
]

// Two delivered orders so the demo user can immediately write reviews
export const ORDERS = [
  {
    id: '1', userId: '1',
    orderDate: '2026-01-10T10:00:00Z',
    status: 'delivered',
    total: 20300,
    shippingInfo: { name: 'Clara Silva', email: 'customer@example.com', phone: '', address: '12 Calle Mayor, Madrid, Spain' },
  },
  {
    id: '2', userId: '1',
    orderDate: '2026-01-28T14:00:00Z',
    status: 'delivered',
    total: 38000,
    shippingInfo: { name: 'Clara Silva', email: 'customer@example.com', phone: '', address: '12 Calle Mayor, Madrid, Spain' },
  },
  {
    id: '3', userId: '1',
    orderDate: '2026-02-15T09:30:00Z',
    status: 'processing',
    total: 24500,
  },
]

export const ORDER_ITEMS = [
  // Order 1 (delivered)
  { id: '1', orderId: '1', productId: '1', quantity: 1, priceAtPurchase: 7500 },
  { id: '2', orderId: '1', productId: '2', quantity: 1, priceAtPurchase: 12800 },
  // Order 2 (delivered)
  { id: '3', orderId: '2', productId: '4', quantity: 1, priceAtPurchase: 16500 },
  { id: '4', orderId: '2', productId: '3', quantity: 2, priceAtPurchase: 9500 },
  // Order 3 (processing — cannot review yet)
  { id: '5', orderId: '3', productId: '5', quantity: 1, priceAtPurchase: 24500 },
]

// ── REVIEWS ──────────────────────────────────────────────────────────────────
// productId: which product the review is for
// userId:    who wrote it (used to check "already reviewed" and for ownership)
// orderId:   which delivered order unlocked this review
// verified:  always true for reviews created through the order flow
export const REVIEWS = [
  {
    id: '1',
    productId: '1',
    userId: '1',
    orderId: '1',
    author: 'Clara Silva',
    rating: 5,
    title: 'Absolutely stunning',
    titleEs: 'Absolutamente impresionante',
    text: 'The silk feels incredibly luxurious. Perfect everyday piece.',
    textEs: 'La seda se siente increíblemente lujosa. Pieza perfecta para el día a día.',
    date: '2026-01-20T11:00:00Z',
    verified: true,
  },
  {
    id: '2',
    productId: '3',
    userId: null,   // anonymous seed review
    orderId: null,
    author: 'Sophie M.',
    rating: 5,
    title: 'Hand-painted beauty',
    titleEs: 'Belleza pintada a mano',
    text: 'Every brushstroke is visible. A true work of art.',
    textEs: 'Cada pincelada es visible. Una verdadera obra de arte.',
    date: '2026-01-28T09:00:00Z',
    verified: false,
  },
  {
    id: '3',
    productId: '2',
    userId: null,
    orderId: null,
    author: 'Elena R.',
    rating: 5,
    title: 'Perfect drape',
    titleEs: 'Caída perfecta',
    text: 'Perfect fit, the drape is beautiful. Will definitely order again.',
    textEs: 'Talla perfecta, la caída es preciosa. Definitivamente volveré a pedir.',
    date: '2026-01-30T15:00:00Z',
    verified: false,
  },
  {
    id: '4',
    productId: '4',
    userId: null,
    orderId: null,
    author: 'Marc B.',
    rating: 4,
    title: 'Premium quality',
    titleEs: 'Calidad premium',
    text: 'Great quality silk shirt. The buttons are a lovely detail.',
    textEs: 'Camisa de seda de gran calidad. Los botones son un detalle precioso.',
    date: '2026-02-01T08:30:00Z',
    verified: false,
  },
]

export const SERVICE_INQUIRIES = [
  {
    id: '1', userId: '2',
    description: '50 silk blouses for AW capsule collection.',
    status: 'in_review',  createdAt: '2026-02-02T12:00:00Z',
    quantity: 50,  deadline: '2026-03-01', fabrics: '',
  },
  {
    id: '2', userId: '2',
    description: '100 silk scarves with custom embroidery for SS25.',
    status: 'approved',   createdAt: '2026-02-05T09:30:00Z',
    quantity: 100, deadline: '2026-02-28', fabrics: '',
  },
  {
    id: '3', userId: '2',
    description: '25 silk dresses - bias cut, midnight navy.',
    status: 'production', createdAt: '2026-01-28T14:20:00Z',
    quantity: 25,  deadline: '2026-02-20', fabrics: '',
  },
  {
    id: '4', userId: '2',
    description: '200 silk shirts for corporate uniforms.',
    status: 'completed',  createdAt: '2026-01-15T11:00:00Z',
    quantity: 200, deadline: '2026-02-10', fabrics: '',
  },
  {
    id: '5', userId: '2',
    description: '75 silk pillowcases - hotel collection.',
    status: 'pending',    createdAt: '2026-02-07T16:45:00Z',
    quantity: 75,  deadline: '2026-03-15', fabrics: '',
  },
  {
    id: '6', userId: '2',
    description: '30 silk robes for spa collection.',
    status: 'in_review',  createdAt: '2026-02-06T10:15:00Z',
    quantity: 30,  deadline: '2026-03-05', fabrics: '',
  },
]

export const NOTIFICATIONS_DEFAULTS = {
  emailOrders:    true,
  emailMarketing: false,
  emailQuotes:    true,
  emailProjects:  true,
  smsOrders:      false,
  smsQuotes:      false,
  smsMarketing:   false,
}