// src/App.jsx - COMPLETE (BrandLayout REMOVED)
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ServicesPage from "./pages/ServicesPage";
import AuthPage from "./pages/AuthPage";
import CatalogPage from "./pages/CatalogPage";
import CartPage from "./pages/CartPage";
import CustomerDashboardPage from "./pages/CustomerDashboardPage";
import BrandDashboardPage from "./pages/BrandDashboardPage";
import BrandQuotePage from "./pages/BrandQuotePage";
import BrandProjectsPage from "./pages/BrandProjectsPage";
import BrandProfilePage from "./pages/BrandProfilePage";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { CartProvider } from "./contexts/CartContext";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import CustomerQuotePage from "./pages/CustomerQuotePage";
// ✅ BrandLayout import REMOVED

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* CUSTOMER-ONLY ROUTES */}
            <Route
              path="/customer"
              element={
                <ProtectedRoute requireCustomer>
                  <CustomerDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route
              path="/customer/quote"
              element={
                <ProtectedRoute requireCustomer>
                  <CustomerQuotePage />
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

            {/* ✅ BRAND ROUTES - DIRECT (No BrandLayout wrapper) */}
            <Route
              path="/brand"
              element={
                <ProtectedRoute requireCustomer={false}>
                  <BrandDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/brand/quote"
              element={
                <ProtectedRoute requireCustomer={false}>
                  <BrandQuotePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/brand/projects"
              element={
                <ProtectedRoute requireCustomer={false}>
                  <BrandProjectsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/brand/profile"
              element={
                <ProtectedRoute requireCustomer={false}>
                  <BrandProfilePage />
                </ProtectedRoute>
              }
            />

            {/* 404 FALLBACK */}
            <Route
              path="*"
              element={
                <div className="mx-auto flex min-h-[100vh-4rem] max-w-4xl items-center justify-center px-4 py-12 text-[#181818]">
                  <div className="text-center">
                    <h1 className="font-serif text-3xl text-[#13293D]">
                      Page not found
                    </h1>
                    <p className="mt-4 text-sm text-[#5A5A5A]">
                      The page you are looking for does not exist.
                    </p>
                    <Link
                      to="/"
                      className="mt-6 inline-block rounded-full border border-[#13293D] px-6 py-2 text-xs uppercase tracking-wide text-[#13293D] hover:bg-[#13293D] hover:text-white transition-all"
                    >
                      Go Home
                    </Link>
                  </div>
                </div>
              }
            />
          </Routes>
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
