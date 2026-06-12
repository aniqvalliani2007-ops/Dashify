import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Button from '../components/common/Button'
import { HelpCircle, ArrowLeft } from 'lucide-react'

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.03),transparent)] pointer-events-none" />
      
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 z-10 max-w-md mx-auto gap-6">
        <div className="p-4 rounded-full bg-slate-900 border border-slate-800 text-indigo-400">
          <HelpCircle size={40} className="animate-bounce" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-indigo-500">404</h1>
          <h2 className="text-xl font-bold text-slate-200">Page Not Found</h2>
          <p className="text-slate-400 text-sm">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        <Link to="/" className="w-full">
          <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
            <ArrowLeft size={16} />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
