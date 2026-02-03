import { useAuth } from '../hooks/useAuth'

function AuthPage() {
  const { loginAsCustomer, loginAsBrand, logout, user } = useAuth()

  return (
    <div className="mx-auto max-w-md px-4 py-12 text-[#181818]">
      <h1 className="font-serif text-2xl text-[#13293D]">Authentication</h1>

      <p className="mt-4 text-sm text-[#5A5A5A]">
        Temporary login simulation to control access to customer and brand
        areas.
      </p>

      <div className="mt-6 space-y-3">
        <button
          onClick={loginAsCustomer}
          className="w-full rounded-full bg-[#13293D] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
        >
          Login as Customer
        </button>
        <button
          onClick={loginAsBrand}
          className="w-full rounded-full bg-[#B86B77] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
        >
          Login as Brand
        </button>
        <button
          onClick={logout}
          className="w-full rounded-full border border-[#13293D] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#13293D]"
        >
          Logout
        </button>
      </div>

      <p className="mt-4 text-xs text-[#5A5A5A]">
        Current user role: {user?.role ?? 'none'}
      </p>
    </div>
  )
}

export default AuthPage
