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
import AccountSettingsPage from "./pages/AccountSettingsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
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
              path="/catalog/:id"
              element={
                <ProtectedRoute>
                  <ProductDetailPage />
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
              path="/settings"
              element={
                <ProtectedRoute>
                  <AccountSettingsPage />
                </ProtectedRoute>
              }
            />

            {/* 404 FALLBACK */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
