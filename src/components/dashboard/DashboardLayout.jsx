import React, { useState } from 'react'
import Sidebar from './Sidebar'
import { Menu, X, Search, Download, Rocket, Settings, User } from 'lucide-react'

export const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f4f7f6] text-gray-900 flex font-sans">
      {/* Mobile Sidebar Hamburger Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-green-700 hover:bg-green-800 text-white p-2.5 transition-colors cursor-pointer shadow-md rounded-md"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar component - Consist style */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 transform lg:transform-none lg:static lg:block lg:shrink-0
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onCloseMobile={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
          {/* Search */}
          <div className="flex-1 max-w-md flex items-center gap-2 px-4 py-2 bg-[#f4f7f6] rounded-md">
            <Search size={16} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search anything here..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400 text-gray-700"
            />
          </div>
          
          {/* Right Icons */}
          <div className="hidden sm:flex items-center gap-4 text-gray-500">
            <button className="hover:text-gray-900 transition-colors"><Download size={18} /></button>
            <button className="hover:text-gray-900 transition-colors"><Rocket size={18} /></button>
            <button className="hover:text-gray-900 transition-colors"><Settings size={18} /></button>
            <div className="w-8 h-8 rounded-full bg-orange-400 ml-2 overflow-hidden border border-orange-200 shadow-sm flex items-center justify-center text-white font-semibold">
              U
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
