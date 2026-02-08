// src/pages/BrandProjectsPage.jsx
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import dashboardApi from '../api/dashboardApi'
import { RefreshCw, Download } from 'lucide-react'

function BrandProjectsPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (!user?.id) return
    loadProjects()
  }, [user?.id, statusFilter])

  const loadProjects = () => {
    setLoading(true)
    dashboardApi
      .getBrandOverview(user.id)
      .then((res) => {
        let filtered = res.data || []
        if (statusFilter !== 'all') {
          filtered = filtered.filter((p) => p.status === statusFilter)
        }
        setProjects(filtered)
      })
      .finally(() => setLoading(false))
  }

  const statusConfig = {
    pending: { color: 'bg-orange-100 text-orange-800', border: 'border-orange-200' },
    in_review: { color: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-200' },
    approved: { color: 'bg-blue-100 text-blue-800', border: 'border-blue-200' },
    production: { color: 'bg-indigo-100 text-indigo-800', border: 'border-indigo-200' },
    completed: { color: 'bg-green-100 text-green-800', border: 'border-green-200' }
  }

  return (
    <div className="mx-auto flex flex-col max-w-6xl gap-6 p-6 md:p-8 lg:flex">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-[#13293D]">
            {t('brand.projects.title')}
          </h1>
          <p className="mt-3 text-sm text-[#5A5A5A]">
            {t('brand.projects.subtitle')}
          </p>
        </div>
        {/* <div className="mt-4 flex items-center gap-2 sm:mt-0">
          <button
            onClick={loadProjects}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-[#13293D]/30 px-4 py-2 text-sm text-[#13293D] hover:bg-[#E9E0D8] disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-[#13293D]/30 px-4 py-2 text-sm text-[#13293D] hover:bg-[#E9E0D8]">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div> */}
      </div>

      {/* Status filters */}
      <div className="mt-8 flex flex-wrap gap-2">
        {['all', 'pending', 'in_review', 'approved', 'production', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
              statusFilter === status
                ? 'bg-[#13293D] text-white shadow-md'
                : 'border border-[#D9A441]/30 text-[#5A5A5A] hover:bg-[#E9E0D8]'
            }`}
          >
            {status === 'all' ? 'Todos' : t(`brand.projects.status.${status}`)}
          </button>
        ))}
      </div>

      {/* Projects list */}
      <div className="mt-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full border-4 border-[#D9A441]/20 border-t-[#D9A441] h-12 w-12"></div>
          </div>
        ) : projects.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group rounded-2xl border border-[#D9A441]/20 bg-white p-6 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="font-semibold text-[#13293D] line-clamp-2 group-hover:text-[#D9A441]">
                    {project.description}
                  </h3>
                  <span
                    className={`ml-2 rounded-full px-3 py-1 text-xs font-bold uppercase ${statusConfig[project.status]?.color || 'bg-gray-100 text-gray-800'} ${statusConfig[project.status]?.border}`}
                  >
                    {t(`brand.projects.status.${project.status}`)}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-[#5A5A5A]">
                  <p><span className="font-semibold text-[#13293D]">ID:</span> #{project.id}</p>
                  <p><span className="font-semibold text-[#13293D]">Created:</span> {new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid place-items-center rounded-2xl border-2 border-dashed border-[#D9A441]/30 bg-[#F6F3F0]/50 p-20 text-center">
            <div className="text-[#5A5A5A]">
              <p className="font-serif text-2xl text-[#13293D] mb-4">
                📋 {t('brand.projects.empty')}
              </p>
              <a
                href="/brand/quote"
                className="rounded-full border border-[#13293D] px-8 py-3 text-sm font-semibold uppercase text-[#13293D] hover:bg-[#13293D] hover:text-white"
              >
                Solicitar Cotización
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BrandProjectsPage
