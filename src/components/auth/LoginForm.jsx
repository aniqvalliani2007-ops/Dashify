import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Input from '../common/Input'
import Button from '../common/Button'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export const LoginForm = () => {
  const { signIn, user, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user && !authLoading) {
      window.location.replace('/dashboard')
    }
  }, [user, authLoading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await signIn(email, password)
      toast.success('Successfully logged in!')
      // Immediate redirect
      window.location.replace('/dashboard')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Invalid email or password.')
      toast.error(err.message || 'Login failed')
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-8 rounded glass-card border border-gray-200 relative overflow-hidden shadow-lg">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-500" />
      
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
        <p className="text-gray-600 text-sm mt-2">Sign in to access your dashboard</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2.5 text-red-600 text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          id="email"
          type="email"
          placeholder="name@example.com"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          id="password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>

      <div className="text-center mt-6 text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  )
}

export default LoginForm
