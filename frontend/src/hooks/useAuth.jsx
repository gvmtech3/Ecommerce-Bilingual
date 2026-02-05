// src/hooks/useAuth.js
import { useState, createContext, useContext } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const loginAsCustomer = () =>
    setUser({ id: 1, role: 'customer', name: 'Clara Silva' })

  const loginAsBrand = () =>
    setUser({ id: 2, role: 'brand', name: 'Atelier Aurora' })

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
