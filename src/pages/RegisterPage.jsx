import React from 'react'
import RegisterForm from '../components/auth/RegisterForm'
import Navbar from '../components/common/Navbar'

export const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-blue-100/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-blue-50/30 blur-[120px] pointer-events-none" />
      
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6 z-10">
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterPage
