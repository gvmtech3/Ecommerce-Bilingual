// src/components/layout/Layout.jsx
import Navigation from './Navigation'
import Footer from './Footer'
import { useAuth } from '../../hooks/useAuth'

function Layout({ children }) {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="min-h-screen bg-[#E9E0D8]/90 text-[#181818]">
      <Navigation />
      <main className="pt-16">{children}</main>
      <Footer 
        isAuthenticated={isAuthenticated}
        role={user?.role}
      />
    </div>
  )
}

export default Layout