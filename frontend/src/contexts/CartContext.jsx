// src/contexts/CartContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.find(item => item.id === action.payload.id)
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...state, { ...action.payload, quantity: 1 }]

    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0)

    case 'REMOVE_FROM_CART':
      return state.filter(item => item.id !== action.payload.id)

    case 'CLEAR_CART':
      return []

    case 'SET_CART':
      return action.payload

    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('cart') || '[]')
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => dispatch({ type: 'ADD_TO_CART', payload: product })
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: { id } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })
  const getCartCount = () => cart.reduce((sum, item) => sum + item.quantity, 0)
  const getCartTotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartCount,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
