import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from '../common/Navbar'
import { Menu, X } from 'lucide-react'

export const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
      {/* Top Navbar - Clean white */}
      <Navbar />

      <div className="flex-1 flex relative overflow-hidden">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 sm:p-3.5 transition-colors cursor-pointer shadow-lg rounded-full"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Sidebar Overlay (Mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar component - Dark Power BI style */}
        <div className={`
          fixed inset-y-0 left-0 z-40 w-64 sm:w-56 transform lg:transform-none lg:static lg:block
          transition-transform duration-300 ease-in-out sidebar-dark
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <Sidebar onCloseMobile={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content Area - Light gray background, more compact padding */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5 bg-gray-50">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
