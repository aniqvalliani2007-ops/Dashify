import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LayoutDashboard, LogOut, BarChart3 } from 'lucide-react'

export const Navbar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      // Wait for sign out to complete
      await signOut()
      // Then redirect directly to login using React Router
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('Sign out error:', err)
      // Still redirect even if error
      navigate('/login', { replace: true })
    }
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' }
  ]

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-gray-200 px-6 py-4 bg-white">
      <div className="flex items-center justify-between relative">
        {/* Brand logo - Left */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-blue-600 p-1.5 group-hover:bg-blue-700 transition-colors">
            <BarChart3 size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Dashify
          </span>
        </Link>

        {/* Center nav links - Absolutely centered */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </div>

        {/* Right nav controls - Right */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <div className="h-4 w-px bg-gray-300 hidden sm:block" />
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center p-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 transition-all duration-200 cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
