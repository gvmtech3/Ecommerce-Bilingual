// src/api/mockData.js
// Mirrors db.json exactly — drop db.json and json-server, this is the source of truth.
// All IDs are strings for consistency across the app.

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
    price: 7500, imageUrl: '/images/products/silk-wrap-blouse.jpg',
    stock: 12, tag: 'bestseller',
  },
  {
    id: '2', categoryId: '2',
    name: 'Midnight Silk Dress',      nameEs: 'Vestido de Seda Midnight',
    description: 'Bias-cut dress in deep ink silk with subtle shine.',
    descriptionEs: 'Vestido al bies en seda tinta profunda con brillo sutil.',
    price: 12800, imageUrl: '/images/products/midnight-silk-dress.jpg',
    stock: 5, tag: 'new',
  },
  {
    id: '3', categoryId: '3',
    name: 'Handpainted Silk Scarf',   nameEs: 'Pañuelo de Seda Pintado a Mano',
    description: 'Hand-painted 90×90 cm silk twill scarf.',
    descriptionEs: 'Pañuelo de seda twill 90×90 cm pintado a mano.',
    price: 9500, imageUrl: '/images/products/silk-scarf.jpg',
    stock: 20, tag: 'new',
  },
  {
    id: '4', categoryId: '4',
    name: 'Classic Silk Shirt',       nameEs: 'Camisa Clásica de Seda',
    description: 'Timeless silk shirt with mother-of-pearl buttons.',
    descriptionEs: 'Camisa de seda atemporal con botones de nácar.',
    price: 16500, imageUrl: '/images/products/classic-silk-shirt.jpg',
    stock: 8, tag: 'bestseller',
  },
  {
    id: '5', categoryId: '5',
    name: 'Silk Lounge Robe',         nameEs: 'Bata de Seda Loungewear',
    description: 'Relaxed kimono-style robe in pure charmeuse silk.',
    descriptionEs: 'Bata estilo kimono en seda charmeuse pura.',
    price: 24500, imageUrl: '/images/products/silk-robe.jpg',
    stock: 6, tag: 'trending',
  },
  {
    id: '6', categoryId: '6',
    name: 'Structured Silk Top',      nameEs: 'Top Estructurado de Seda',
    description: 'Sleeveless structured top with invisible side zip.',
    descriptionEs: 'Top sin mangas estructurado con cremallera lateral invisible.',
    price: 13500, imageUrl: '/images/products/silk-top.jpg',
    stock: 14, tag: 'trending',
  },
  {
    id: '7', categoryId: '7',
    name: 'Wide-Leg Silk Trousers',   nameEs: 'Pantalón de Seda Palazzo',
    description: 'Fluid wide-leg trousers in ivory silk.',
    descriptionEs: 'Pantalón palazzo fluido en seda marfil.',
    price: 21000, imageUrl: '/images/products/silk-trousers.jpg',
    stock: 9, tag: 'new',
  },
  {
    id: '8', categoryId: '2',
    name: 'Draped Silk Evening Gown', nameEs: 'Vestido de Noche en Seda',
    description: 'Floor-length draped gown with cowl neckline.',
    descriptionEs: 'Vestido largo drapeado con escote vaca.',
    price: 42000, imageUrl: '/images/products/evening-gown.jpg',
    stock: 0, tag: 'bestseller',
  },
]

export const ORDERS = [
  {
    id: '1', userId: '1',
    orderDate: '2026-02-01T10:00:00Z',
    status: 'placed', total: 20300,
  },
]

export const ORDER_ITEMS = [
  { id: '1', orderId: '1', productId: '1', quantity: 1, priceAtPurchase: 7500 },
  { id: '2', orderId: '1', productId: '2', quantity: 1, priceAtPurchase: 12800 },
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