// src/hooks/useAuth.js
import { useState, createContext, useContext } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // user example: { role: 'customer' } or { role: 'brand' }

  const loginAsCustomer = () => setUser({ role: 'customer' })
  const loginAsBrand = () => setUser({ role: 'brand' })
  const logout = () => setUser(null)

  const value = {
    user,
    isAuthenticated: !!user,
    loginAsCustomer,
    loginAsBrand,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
