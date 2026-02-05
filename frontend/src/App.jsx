// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import AuthPage from './pages/AuthPage'
import CatalogPage from './pages/CatalogPage'
import CartPage from './pages/CartPage'
import CustomerDashboardPage from './pages/CustomerDashboardPage'
import BrandDashboardPage from './pages/BrandDashboardPage'
import { AuthProvider } from './hooks/useAuth'
import ProtectedRoute from './components/layout/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Customer-only routes */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute requireCustomer>
                <CustomerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalog"
            element={
              <ProtectedRoute requireCustomer>
                <CatalogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute requireCustomer>
                <CartPage />
              </ProtectedRoute>
            }
          />

          {/* Brand-only or any authenticated user */}
          <Route
            path="/brand"
            element={
              <ProtectedRoute requireCustomer={false}>
                <BrandDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect root dashboard based on role */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireCustomer={false}>
                <Navigate 
                  to="/customer" 
                  replace 
                />
              </ProtectedRoute>
            }
          />

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div className="mx-auto flex min-h-100 max-w-4xl items-center justify-center px-4 py-12 text-[#181818]">
                <div className="text-center">
                  <h1 className="font-serif text-3xl text-[#13293D]">
                    Page not found
                  </h1>
                  <p className="mt-4 text-sm text-[#5A5A5A]">
                    The page you are looking for does not exist.
                  </p>
                  <a
                    href="/"
                    className="mt-6 inline-block rounded-full border border-[#13293D] px-6 py-2 text-xs uppercase tracking-wide text-[#13293D] hover:bg-[#13293D] hover:text-white"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App
