import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/common/Navbar'
import { ArrowUp, Sparkles, Code, FileSpreadsheet, BarChart2, PieChart, Activity, Send, Check } from 'lucide-react'

export const LandingPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Upload')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const mockData = [
    { company: 'TechNova', country: 'United States', employees: '450', revenue: '$15M', status: 'Active' },
    { company: 'DataSphere', country: 'Germany', employees: '120', revenue: '$4.2M', status: 'Pending' },
    { company: 'CloudScale', country: 'United Kingdom', employees: '280', revenue: '$8.5M', status: 'Active' },
    { company: 'NexusAI', country: 'Canada', employees: '85', revenue: '$2.1M', status: 'Active' },
  ]

  const handleContactSubmit = (e) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans relative overflow-x-hidden flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative pt-20 sm:pt-28 pb-16 px-4 z-10 w-full max-w-7xl mx-auto flex-1">
        {/* Floating Decorative Elements - Left */}
        <div className="hidden lg:block absolute left-0 top-10 bottom-0 w-64 pointer-events-none">
          <div className="absolute top-10 left-4 w-16 h-16 bg-blue-100 rounded-sm opacity-60 backdrop-blur-md transform -rotate-6"></div>
          <div className="absolute top-32 left-12 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-sm opacity-80 shadow-xl flex items-center justify-center text-white font-mono text-xs p-2">
            <div className="grid grid-cols-2 gap-1 opacity-50">
              <span>0</span><span>1</span>
              <span>1</span><span>0</span>
              <span>0</span><span>1</span>
            </div>
          </div>
          <div className="absolute top-64 left-2 w-20 h-20 bg-blue-200 rounded-sm opacity-50 backdrop-blur-md transform rotate-12"></div>
        </div>

        {/* Floating Decorative Elements - Right */}
        <div className="hidden lg:block absolute right-0 top-10 bottom-0 w-64 pointer-events-none">
          <div className="absolute top-20 right-16 w-20 h-20 bg-gradient-to-bl from-teal-200 to-blue-300 rounded-sm opacity-70 shadow-lg transform rotate-6"></div>
          <div className="absolute top-48 right-8 w-16 h-16 bg-blue-100 rounded-sm opacity-60 backdrop-blur-md"></div>
          <div className="absolute top-72 right-12 w-24 h-24 bg-gradient-to-tr from-blue-400 to-indigo-400 rounded-sm opacity-80 shadow-xl"></div>
        </div>

        {/* Hero Content */}
        <div className="text-center w-full max-w-4xl mx-auto mb-12 relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-bold text-gray-900 tracking-tight leading-tight mb-6">
            Data analytics, built for everyone
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 mb-8 max-w-2xl mx-auto font-medium">
            One platform for uploading, visualizing, and analyzing your CSV data
          </p>
          <Link
            to={user ? '/dashboard' : '/register'}
            className="inline-flex items-center justify-center bg-black hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-md transition-colors text-sm sm:text-base"
          >
            Try Dashify for free
          </Link>
        </div>

        {/* Dashboard Preview Image */}
        <div className="w-full max-w-6xl mx-auto mt-12 relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
          <img src="/dashboard-mockup.png" alt="Dashify Dashboard Preview" className="w-full h-auto object-cover block" />
        </div>

        {/* Logos Section */}
        <div className="w-full max-w-4xl mx-auto mt-20 flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
          <div className="text-xl font-bold font-sans tracking-tight">databricks</div>
          <div className="text-2xl font-bold font-sans tracking-tighter">groq</div>
          <div className="text-xl font-black font-sans uppercase tracking-widest">GAMMA</div>
          <div className="text-lg font-bold font-sans flex items-center gap-1">
            <div className="flex gap-0.5"><div className="w-1.5 h-3 bg-current rounded-sm transform rotate-12"></div><div className="w-1.5 h-3 bg-current rounded-sm transform rotate-12"></div></div>
            monday<span className="font-normal text-sm">.com</span>
          </div>
          <div className="text-xl font-bold font-sans">HubSpot</div>
        </div>
      </section>

      {/* Features Section (Alternating Layout) */}
      <section id="features" className="py-24 px-4 w-full bg-white relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">POWERFUL FEATURES</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Designed to make your data work for you
            </h2>
          </div>

          <div className="space-y-32">
            {/* Feature 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
              <div className="w-full lg:w-1/2 relative">
                {/* Mockup Dashboard UI */}
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 shadow-xl aspect-square sm:aspect-[4/3] flex flex-col relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent"></div>
                  <div className="flex gap-4 mb-6 relative z-10">
                    <div className="bg-white p-4 rounded-md shadow-sm flex-1 border border-gray-100">
                      <BarChart2 size={20} className="text-blue-500 mb-2" />
                      <div className="text-2xl font-bold text-gray-900">1.2M</div>
                      <div className="text-xs text-gray-500">Total Records</div>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow-sm flex-1 border border-gray-100">
                      <Activity size={20} className="text-green-500 mb-2" />
                      <div className="text-2xl font-bold text-gray-900">84%</div>
                      <div className="text-xs text-gray-500">Data Integrity</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-md shadow-sm border border-gray-100 flex-1 p-4 relative z-10 flex flex-col">
                    <div className="text-sm font-medium text-gray-800 mb-4">Revenue Overview</div>
                    <div className="flex-1 flex items-end gap-2 px-2">
                      {[40, 70, 45, 90, 65, 85, 110].map((h, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-sm" style={{ height: `${h}%` }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-4">
                  Interactive charts and visualizations
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Transform raw CSV data into stunning visual representations instantly. Our platform automatically detects data types and suggests the most effective charts to uncover hidden trends.
                </p>
                <div className="flex items-center gap-2 mb-8">
                  <button className="text-sm font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded transition-colors flex items-center gap-2">
                    Explore visualizations <ArrowUp size={14} className="transform rotate-45" />
                  </button>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-md text-sm text-gray-600">
                  <span className="font-bold text-gray-900 block mb-1 text-[10px] uppercase tracking-widest">Dashify Core</span>
                  Powers data analysts with lightning-fast rendering and intuitive filter controls across large datasets.
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-24">
              <div className="w-full lg:w-1/2 relative">
                {/* Mockup AI Agent UI */}
                <div className="bg-blue-600 rounded-lg p-6 shadow-xl aspect-square sm:aspect-[4/3] flex flex-col relative overflow-hidden text-white">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-blue-600 to-blue-900 opacity-80"></div>
                  
                  {/* Floating abstract particles */}
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)]"></div>
                  <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,1)]"></div>
                  <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]"></div>
                  
                  <div className="bg-white/10 backdrop-blur-md rounded-md border border-white/20 p-5 mt-auto relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={16} className="text-blue-200" />
                      <span className="text-xs font-bold uppercase tracking-widest text-blue-100">AI Insights</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white">
                      Based on your recent uploads, <span className="bg-white/20 px-1 py-0.5 rounded font-medium">Q3 Revenue</span> is up by 24%, driven primarily by the <span className="bg-white/20 px-1 py-0.5 rounded font-medium">Enterprise sector</span>.
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-4">
                  Instant AI-powered insights
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Stop writing complex formulas. Ask questions in plain English and let our specialized AI models analyze your datasets, generate highlights, and summarize key metrics.
                </p>
                <div className="flex items-center gap-2 mb-8">
                  <button className="text-sm font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded transition-colors flex items-center gap-2">
                    Try AI Agent <ArrowUp size={14} className="transform rotate-45" />
                  </button>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-md text-sm text-gray-600">
                  <span className="font-bold text-gray-900 block mb-1 text-[10px] uppercase tracking-widest">Built for Speed</span>
                  Optimized token usage ensuring fast, highly relevant responses even on massive CSV files.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 w-full bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Get in touch
          </h2>
          <p className="text-lg text-gray-500 mb-10 font-medium">
            Have questions about enterprise plans or custom integrations? We're here to help.
          </p>

          <form onSubmit={handleContactSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input type="text" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all text-sm" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input type="text" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all text-sm" placeholder="Doe" />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Email</label>
              <input type="email" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all text-sm" placeholder="john@company.com" />
            </div>
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea required rows="4" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all text-sm resize-none" placeholder="How can we help you?"></textarea>
            </div>
            <button 
              type="submit" 
              className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all ${isSubmitted ? 'bg-green-600 hover:bg-green-700' : 'bg-black hover:bg-gray-800'}`}
            >
              {isSubmitted ? (
                <><Check size={18} className="mr-2" /> Message Sent</>
              ) : (
                <><Send size={18} className="mr-2" /> Send Message</>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-4 w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-blue-600 p-1 rounded-sm">
              <BarChart2 size={16} className="text-white" />
            </div>
            <span className="text-lg font-medium tracking-tight text-gray-900">
              Dashify
            </span>
          </div>
          
          <div className="flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#home" className="hover:text-gray-900 transition-colors">Home</a>
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#contact" className="hover:text-gray-900 transition-colors">Contact</a>
            <Link to="/login" className="hover:text-gray-900 transition-colors">Log in</Link>
          </div>
          
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Dashify. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

