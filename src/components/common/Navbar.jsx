import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LayoutDashboard, LogOut, BarChart3, Menu, X } from 'lucide-react'
import toast from 'react-hot-toast'

export const Navbar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('Sign out error:', err)
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
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-gray-200 px-4 sm:px-6 py-4 bg-white">
      <div className="flex items-center justify-between relative">
        {/* Brand logo - Left */}
        <Link to="/" className="flex items-center gap-2.5 group z-50">
          <div className="bg-blue-600 p-1.5 group-hover:bg-blue-700 transition-colors">
            <BarChart3 size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Dashify
          </span>
        </Link>

        {/* Center nav links - Absolutely centered - Hidden on mobile */}
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
        <div className="flex items-center gap-3 z-50">
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
                className="hidden sm:inline-block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5"
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
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg md:hidden z-40">
            <div className="flex flex-col py-4 px-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-4 py-3 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="sm:hidden text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4 py-3 transition-colors"
                >
                  Log in
                </Link>
              )}
              {user && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="sm:hidden text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-4 py-3 transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  )
}

export default Navbar
