// src/pages/CustomerDashboardPage.jsx - Complete orders dashboard
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import axiosClient from '../api/axiosClient'

function CustomerDashboardPage() {
  const { t } = useTranslation()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('latest')  // latest, month, year
  const [currentPage, setCurrentPage] = useState(1)
  const [ordersPerPage] = useState(5)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      // Mock orders data - replace with your API
      const mockOrders = [
        {
          id: '#ORD-001',
          date: '2026-02-05',
          items: 3,
          total: '$267.00',
          status: 'delivered',
          products: ['Silk Blouse x2', 'Satin Dress x1']
        },
        {
          id: '#ORD-002', 
          date: '2026-01-28',
          items: 1,
          total: '$129.00',
          status: 'processing',
          products: ['Cashmere Scarf x1']
        },
        // Add 20+ mock orders for pagination testing
      ]

      // Filter logic
      let filteredOrders = mockOrders
      const now = new Date()
      
      if (filter === 'month') {
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)
        filteredOrders = mockOrders.filter(order => new Date(order.date) >= oneMonthAgo)
      } else if (filter === 'year') {
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        filteredOrders = mockOrders.filter(order => new Date(order.date) >= oneYearAgo)
      }

      setOrders(filteredOrders)
    } catch (error) {
      console.error('Orders fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(orders.length / ordersPerPage)

  const statusColors = {
    delivered: 'bg-green-100 text-green-800',
    processing: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full border-4 border-[#D9A441]/20 border-t-[#D9A441] h-12 w-12"></div>
      </div>
    )
  }

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Stats Cards */}
        <div className="lg:w-1/3 space-y-6 mb-12 lg:mb-0">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#D9A441]/20">
            <h3 className="font-serif text-2xl text-[#13293D] mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Orders</span>
                <span className="font-bold text-2xl text-[#D9A441]">{orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Spent</span>
                <span className="font-bold text-xl text-[#13293D]">$1,250.00</span>
              </div>
            </div>
          </div>
          
          {/* Filter Buttons */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#D9A441]/20">
            <h4 className="font-serif text-xl text-[#13293D] mb-4">Filter Orders</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button
                onClick={() => { setFilter('latest'); setCurrentPage(1) }}
                className={`p-3 rounded-xl font-semibold transition-all ${
                  filter === 'latest'
                    ? 'bg-[#13293D] text-white shadow-md'
                    : 'border border-[#13293D]/30 text-[#181818] hover:bg-[#E9E0D8]'
                }`}
              >
                Latest
              </button>
              <button
                onClick={() => { setFilter('month'); setCurrentPage(1) }}
                className={`p-3 rounded-xl font-semibold transition-all ${
                  filter === 'month'
                    ? 'bg-[#13293D] text-white shadow-md'
                    : 'border border-[#13293D]/30 text-[#181818] hover:bg-[#E9E0D8]'
                }`}
              >
                Past Month
              </button>
              <button
                onClick={() => { setFilter('year'); setCurrentPage(1) }}
                className={`p-3 rounded-xl font-semibold transition-all col-span-2 ${
                  filter === 'year'
                    ? 'bg-[#13293D] text-white shadow-md'
                    : 'border border-[#13293D]/30 text-[#181818] hover:bg-[#E9E0D8]'
                }`}
              >
                Past Year
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-lg border border-[#D9A441]/20 overflow-hidden">
            <div className="p-8 border-b border-[#D9A441]/20">
              <h2 className="font-serif text-2xl text-[#13293D]">
                My Orders ({orders.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F6F3F0]">
                  <tr>
                    <th className="p-6 text-left font-semibold text-[#5A5A5A]">Order ID</th>
                    <th className="p-6 text-left font-semibold text-[#5A5A]">Date</th>
                    <th className="p-6 text-left font-semibold text-[#5A5A]">Items</th>
                    <th className="p-6 text-left font-semibold text-[#5A5A]">Total</th>
                    <th className="p-6 text-left font-semibold text-[#5A5A]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order) => (
                    <tr key={order.id} className="border-t border-[#D9A441]/10 hover:bg-[#F6F3F0]/50">
                      <td className="p-6 font-mono text-[#13293D]">{order.id}</td>
                      <td className="p-6">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="p-6">{order.items}</td>
                      <td className="p-6 font-bold text-[#13293D]">{order.total}</td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-8 border-t border-[#D9A441]/20 bg-[#F6F3F0]/50">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-[#13293D]/30 text-[#13293D] hover:bg-white disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        currentPage === page
                          ? 'bg-[#13293D] text-white shadow-md'
                          : 'border border-[#13293D]/30 text-[#13293D] hover:bg-white'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-[#13293D]/30 text-[#13293D] hover:bg-white disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboardPage
