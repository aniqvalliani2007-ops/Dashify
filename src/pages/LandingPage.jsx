import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/common/Navbar'
import { ArrowUp, Sparkles, Code, FileSpreadsheet, Download } from 'lucide-react'

export const LandingPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Upload')

  const mockData = [
    { company: 'TechNova', country: 'United States', employees: '450', revenue: '$15M', status: 'Active' },
    { company: 'DataSphere', country: 'Germany', employees: '120', revenue: '$4.2M', status: 'Pending' },
    { company: 'CloudScale', country: 'United Kingdom', employees: '280', revenue: '$8.5M', status: 'Active' },
    { company: 'NexusAI', country: 'Canada', employees: '85', revenue: '$2.1M', status: 'Active' },
    { company: 'QuantumFlow', country: 'France', employees: '310', revenue: '$11M', status: 'Pending' },
    { company: 'StreamLine', country: 'Australia', employees: '150', revenue: '$5.8M', status: 'Active' }
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans relative overflow-hidden flex flex-col">
      <Navbar />

      {/* Floating Decorative Elements - Left */}
      <div className="hidden lg:block absolute left-0 top-32 bottom-0 w-64 pointer-events-none">
        <div className="absolute top-10 left-4 w-16 h-16 bg-blue-100 rounded-sm opacity-60 backdrop-blur-md transform -rotate-6"></div>
        <div className="absolute top-32 left-12 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-sm opacity-80 shadow-xl flex items-center justify-center text-white font-mono text-xs p-2">
          <div className="grid grid-cols-2 gap-1 opacity-50">
            <span>0</span><span>1</span>
            <span>1</span><span>0</span>
            <span>0</span><span>1</span>
          </div>
        </div>
        <div className="absolute top-64 left-2 w-20 h-20 bg-blue-200 rounded-sm opacity-50 backdrop-blur-md transform rotate-12"></div>
        <div className="absolute top-96 left-8 w-28 h-28 bg-gradient-to-tr from-blue-300 to-cyan-300 rounded-sm opacity-70 shadow-lg"></div>
        <div className="absolute top-[32rem] left-16 w-16 h-16 bg-blue-500 rounded-sm opacity-60 flex items-center justify-center text-white/40 font-mono text-[8px] p-1">
          const data = [];
        </div>
      </div>

      {/* Floating Decorative Elements - Right */}
      <div className="hidden lg:block absolute right-0 top-32 bottom-0 w-64 pointer-events-none">
        <div className="absolute top-20 right-16 w-20 h-20 bg-gradient-to-bl from-teal-200 to-blue-300 rounded-sm opacity-70 shadow-lg transform rotate-6"></div>
        <div className="absolute top-48 right-8 w-16 h-16 bg-blue-100 rounded-sm opacity-60 backdrop-blur-md"></div>
        <div className="absolute top-72 right-12 w-24 h-24 bg-gradient-to-tr from-blue-400 to-indigo-400 rounded-sm opacity-80 shadow-xl"></div>
        <div className="absolute top-[26rem] right-4 w-20 h-20 bg-cyan-100 rounded-sm opacity-50 transform -rotate-12"></div>
        <div className="absolute top-[34rem] right-20 w-16 h-16 bg-blue-600 rounded-sm opacity-60 shadow-md"></div>
      </div>

      <main className="flex-1 flex flex-col items-center pt-20 sm:pt-28 pb-16 px-4 z-10 w-full max-w-7xl mx-auto">
        
        {/* Hero Content */}
        <div className="text-center w-full max-w-4xl mx-auto mb-12">
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

        {/* Dashboard/App Preview Card */}
        <div className="w-full max-w-5xl mx-auto mt-4 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-gray-800 font-medium text-sm sm:text-base">
              Tech companies with 100+ employees, recent revenue
            </h3>
          </div>

          {/* Search/Filter Bar */}
          <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-50 bg-gray-50/50">
            <div className="flex bg-white rounded-md border border-gray-200 overflow-hidden text-sm shadow-sm">
              <button 
                className={`px-4 py-2 font-medium transition-colors ${activeTab === 'Upload' ? 'text-gray-900 bg-gray-50/50' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('Upload')}
              >
                <div className="flex items-center gap-1.5">
                  <FileSpreadsheet size={14} /> Upload
                </div>
              </button>
              <div className="w-px bg-gray-200"></div>
              <button 
                className={`px-4 py-2 font-medium transition-colors ${activeTab === 'Agent' ? 'text-blue-600 bg-blue-50/10' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('Agent')}
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className={activeTab === 'Agent' ? 'text-blue-600' : ''} /> AI Agent
                </div>
              </button>
            </div>
            
            <div className="flex-1"></div>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md shadow-sm transition-colors">
              <ArrowUp size={16} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Sidebar Controls */}
            <div className="w-full md:w-64 p-6 border-r border-gray-100 bg-gray-50/30 shrink-0">
              <div className="mb-8">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">EFFORT</p>
                <div className="flex bg-gray-100/80 rounded-md p-1">
                  {['Auto', 'Low', 'Medium', 'High'].map(level => (
                    <button 
                      key={level}
                      className={`flex-1 text-xs py-1.5 rounded-sm font-medium ${level === 'Auto' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">OUTPUT</p>
                <div className="flex bg-gray-100/80 rounded-md p-1">
                  <button className="flex-1 bg-white shadow-sm text-gray-900 text-xs py-1.5 rounded-sm font-medium">Table</button>
                  <button className="flex-1 text-gray-500 hover:text-gray-700 text-xs py-1.5 rounded-sm font-medium">Chart</button>
                </div>
              </div>

              <div className="mt-16 flex items-center gap-2">
                <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors shadow-sm">
                  API Playground <ArrowUp size={10} className="transform rotate-45" />
                </button>
                <button className="p-1.5 text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors shadow-sm">
                  <Code size={14} />
                </button>
              </div>
            </div>

            {/* Main Data Table */}
            <div className="flex-1 p-0 overflow-x-auto">
              <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2 text-sm text-green-600 font-medium">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Complete - 6 rows - 5 columns
              </div>
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr>
                    {['COMPANY', 'COUNTRY', 'EMPLOYEES', 'REVENUE', 'STATUS'].map((head) => (
                      <th key={head} className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">{row.company}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{row.country}</td>
                      <td className="px-6 py-3 text-sm text-gray-600 font-mono">{row.employees}</td>
                      <td className="px-6 py-3 text-sm text-gray-600 font-mono">{row.revenue}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Logos Section */}
        <div className="w-full max-w-4xl mx-auto mt-20 flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
          <div className="text-xl font-bold font-sans tracking-tight">databricks</div>
          <div className="text-2xl font-bold font-sans tracking-tighter">groq</div>
          <div className="text-xl font-black font-sans uppercase tracking-widest">GAMMA</div>
          <div className="text-lg font-bold font-sans flex items-center gap-1">
            <div className="flex gap-0.5"><div className="w-1.5 h-3 bg-current rounded-sm transform rotate-12"></div><div className="w-1.5 h-3 bg-current rounded-sm transform rotate-12"></div></div>
            monday<span className="font-normal text-sm">.com</span>
          </div>
          <div className="text-xl font-bold font-sans">HubSpot</div>
        </div>
        
      </main>
    </div>
  )
}

export default LandingPage
