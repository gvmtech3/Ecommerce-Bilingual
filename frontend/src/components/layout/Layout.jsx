import Navigation from './Navigation'
import Footer from './Footer'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#E9E0D8]/90 text-[#181818]">
      <Navigation />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
