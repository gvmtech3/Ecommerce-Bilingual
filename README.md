# 🧵 Linces'CKF — Premium Silk E-Commerce Platform

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)
![i18n](https://img.shields.io/badge/i18next-Bilingual-26A69A?style=flat-square&logo=i18next&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-D9A441?style=flat-square)

**A bilingual (English / Spanish) premium silk garment platform combining direct-to-consumer retail with B2B manufacturing services.**

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Authentication](#-authentication) · [Bilingual Support](#-bilingual-support) · [Project Structure](#-project-structure)

---

## 📖 Overview

**Linces'CKF** is a full-featured e-commerce platform built for a premium silk garment brand operating across two distinct business lines:

| Business Line | Description |
|---|---|
| 🛍️ **Direct-to-Consumer (D2C)** | Exclusive silk garments sold directly to end customers via an online catalog, cart, and checkout flow |
| 🏭 **B2B Manufacturing** | Custom silk production services for fashion brands — quote requests, project tracking, and order management |

The platform is **fully bilingual** (English & Spanish), responsive across all devices, and built with a consistent luxury design language using a navy, gold, and cream palette throughout.

> **Current Phase:** Frontend complete with mock API. No backend required to run — all data is served from an in-memory mock layer that mirrors a production REST API shape.

---

## ✨ Features

### 🛒 Customer (D2C) Experience
- **Product Catalog** — infinite scroll, live search, category filtering, and sort controls
- **Product Detail Pages** — image gallery, size/colour selectors, quantity stepper, reviews, related products
- **Shopping Cart** — add/remove items, quantity updates, variant display (size, colour), real-time totals
- **Checkout Flow** — shipping form, order creation, redirect to animated order success page
- **Customer Dashboard** — order history with expandable line-item detail, date filters, delivery status tracking
- **Custom Quote Requests** — customers can request bespoke orders with project briefs

### 🏭 Brand (B2B) Experience
- **Brand Dashboard** — overview stats, filterable inquiry list with expandable project cards
- **Brand Projects Page** — infinite-scroll project board with status filters
- **Quote Request Form** — structured RFQ submission (quantity, description, deadline, fabrics)
- **Process Sidebar** — 4-step production process guide visible throughout the quote flow

### 🔐 Authentication
- Role-based access control — `customer` and `brand` roles with separate dashboards and navigation
- Session persistence via `localStorage`
- Registration with runtime user creation (persists for the session)
- Pre-filled forms from authenticated user profile

### 🌍 Bilingual Support
- Full English / Spanish support via `react-i18next`
- Language toggle available in the navigation
- All product names, descriptions, UI labels, error messages, and status strings translated
- Locale-aware date and price formatting (`Intl.NumberFormat`, `toLocaleDateString`)

### 🎨 Design System
- Consistent brand palette: Navy `#13293D` · Gold `#D9A441` · Cream `#F6F3F0` · Sage `#dde3d7` · Coral `#ed5e25`
- Frosted glass cards, diagonal stripe textures, ellipse wave section dividers
- Staggered entrance animations, hover micro-interactions, animated success states with confetti
- Fully responsive — mobile-first, tested across all breakpoints

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite 5](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Routing** | [React Router DOM v7](https://reactrouter.com/) |
| **Internationalisation** | [react-i18next](https://react.i18next.com/) |
| **HTTP Client** | [Axios](https://axios-http.com/) (mock layer — no backend required) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Language** | JavaScript (ES2022+) |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) `>= 18.0.0`
- [npm](https://www.npmjs.com/) `>= 9.0.0` or [pnpm](https://pnpm.io/) / [yarn](https://yarnpkg.com/)

### Installation

```bash
cd frontend

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

> No `.env` file or backend setup is required. The mock API layer serves all data in-memory.

---

## 📁 Project Structure

```
linces-ckf/
├── public/                     # Static assets
├── src/
│   ├── api/
│   │   ├── mockData.js         # In-memory data store (users, products, orders, inquiries)
│   │   ├── axiosClient.js      # Drop-in mock axios — same {data} response shape as a real API
│   │   ├── resourcesApi.js     # Typed helpers: ordersApi, productsApi, inquiriesApi, etc.
│   │   └── usersApi.js         # Auth-specific user helpers
│   ├── assets/
│   │   └── images/             # Brand photography and silk imagery
│   ├── contexts/
│   │   └── CartContext.jsx     # Global cart state (add, remove, update, clear)
│   ├── hooks/
│   │   └── useAuth.js          # Authentication hook with login/register/logout/refreshUser
│   ├── i18n/
│   │   ├── en.json             # English translations
│   │   └── es.json             # Spanish translations
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── CatalogPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── OrderSuccessPage.jsx
│   │   ├── CustomerDashboardPage.jsx
│   │   ├── CustomerQuotePage.jsx
│   │   ├── BrandDashboardPage.jsx
│   │   ├── BrandQuotePage.jsx
│   │   ├── BrandProjectsPage.jsx
│   │   ├── ContactPage.jsx
│   │   └── AccountSettingsPage.jsx
│   ├── components/
│   │   ├── Navigation.jsx
│   │   └── Footer.jsx
│   ├── App.jsx                 # Root component with route definitions
│   └── main.jsx                # Entry point
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🔐 Authentication

Authentication is handled entirely on the frontend using the mock user store. Sessions are persisted to `localStorage` so they survive page refreshes.

### Demo Credentials

| Role | Email | Password | Dashboard |
|---|---|---|---|
| 👤 **Customer** | `customer@example.com` | `demo` | `/customer` |
| 🏭 **Brand** | `brand@example.com` | `demo` | `/brand` |

### How It Works

1. `useAuth.js` validates credentials against the runtime user store in `mockData.js`
2. On successful login, the user object is stored in `localStorage` and exposed via React context
3. Navigation links, route guards, and dashboard content are all gated by `user.role`
4. New accounts registered during a session are available immediately (in-memory only — reset on page reload)

### Route Access

```
/catalog              → Public
/catalog/:id          → Public
/cart                 → Public
/customer             → Requires role: customer
/customer/quote       → Requires role: customer
/brand                → Requires role: brand
/brand/quote          → Requires role: brand
/brand/projects       → Requires role: brand
/settings             → Requires authenticated user
```

---

## 🌍 Bilingual Support

The platform uses `react-i18next` for full English/Spanish internationalisation.

### Language Files

Translation keys live in `src/i18n/`:

```
src/i18n/
├── en.json   # English (default)
└── es.json   # Spanish
```

### Usage in Components

```jsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language  // 'en' | 'es'

  return (
    <h1>{t('catalog.pageTitle')}</h1>
  )
}
```

### Switching Language

The language toggle in the Navigation component calls:

```js
i18n.changeLanguage('es')  // or 'en'
```

### Locale-Aware Formatting

Prices and dates adapt to the active language:

```js
// Price formatting
new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

// Date formatting
new Date(dateStr).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-GB', {
  year: 'numeric', month: 'short', day: 'numeric'
})
```

### Bilingual Product Data

Product names and descriptions are stored in dual-language fields in `mockData.js`:

```js
{
  id: '1',
  name: 'Ivory Silk Blouse',       // English
  nameEs: 'Blusa de Seda Marfil',  // Spanish
  description: 'Crafted from...',
  descriptionEs: 'Confeccionada de...',
}
```

---

## 🗄 Mock API Layer

The project ships with a complete in-memory API that mirrors a production REST API — making it trivial to swap in a real backend later.

## 🧭 Page Reference

| Route | Page | Access |
|---|---|---|
| `/` | Home — hero, AI recommendations, brand split | Public |
| `/catalog` | Product catalog — filters, search, infinite scroll | Public |
| `/catalog/:id` | Product detail — gallery, variants, reviews | Public |
| `/cart` | Shopping cart + checkout form | Public |
| `/order-success` | Animated order confirmation with confetti | Post-checkout |
| `/customer` | Customer dashboard — orders, stats, filters | Customer |
| `/customer/quote` | Custom order request form | Customer |
| `/brand` | Brand dashboard — inquiry overview and stats | Brand |
| `/brand/quote` | RFQ submission form | Brand |
| `/brand/projects` | Project board with infinite scroll | Brand |
| `/contact` | Contact page with map | Public |
| `/settings` | Account settings | Authenticated |

---

**Linces'CKF** — *Crafted with precision. Built for scale.*

Made with ❤️ using React + Vite + Tailwind CSS
