// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import AuthPage from './pages/AuthPage'
import CatalogPage from './pages/CatalogPage'
import CartPage from './pages/CartPage'
import { AuthProvider } from './hooks/useAuth'
import ProtectedRoute from './components/layout/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/auth" element={<AuthPage />} />

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

          <Route
            path="*"
            element={
              <div className="mx-auto max-w-4xl px-4 py-12 text-[#181818]">
                <h1 className="font-serif text-3xl text-[#13293D]">
                  Page not found
                </h1>
                <p className="mt-4 text-sm text-[#5A5A5A]">
                  The page you are looking for does not exist.
                </p>
              </div>
            }
          />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App
