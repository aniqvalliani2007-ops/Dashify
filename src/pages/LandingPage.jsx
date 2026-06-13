import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/common/Navbar'
import { BarChart3, Database, ShieldCheck, ArrowRight, Activity, FileSpreadsheet, Sparkles, Zap, TrendingUp, Users, Lock, Cloud, CheckCircle, Star, Quote } from 'lucide-react'

export const LandingPage = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: FileSpreadsheet,
      title: 'Instant CSV Upload',
      desc: 'Drag and drop your CSV files. Automatic column detection and data type inference.'
    },
    {
      icon: Activity,
      title: 'Interactive Charts',
      desc: 'Beautiful bar, line, and pie charts with real-time customization and filtering.'
    },
    {
      icon: Database,
      title: 'Secure Storage',
      desc: 'Enterprise-grade security with row-level access control. Your data stays private.'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Insights',
      desc: 'Ask questions about your data and get intelligent analysis powered by AI.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      desc: 'Process thousands of rows instantly. Optimized for performance and speed.'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      desc: 'Aggregations, filters, and custom calculations. Export results as CSV.'
    }
  ]

  const benefits = [
    {
      icon: CheckCircle,
      title: 'No Installation Required',
      desc: 'Cloud-based platform accessible from any browser. Start analyzing in seconds.'
    },
    {
      icon: Users,
      title: 'Built for Teams',
      desc: 'Collaborate with your team. Share insights and dashboards effortlessly.'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      desc: 'Bank-level encryption and compliance. SOC 2 Type II certified infrastructure.'
    },
    {
      icon: Cloud,
      title: 'Unlimited Storage',
      desc: 'Store all your datasets in the cloud. Access from anywhere, anytime.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Data Analyst at TechCorp',
      content: 'Dashify transformed how we analyze sales data. What used to take hours now takes minutes.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      content: 'The AI insights feature is incredible. It finds patterns we would have missed manually.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Business Intelligence Lead',
      content: 'Clean interface, powerful features. Our entire team switched to Dashify within a week.',
      rating: 5
    }
  ]

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '1M+', label: 'Files Processed' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' }
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left: Hero Content */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold mb-4 sm:mb-6">
                <Sparkles size={14} />
                <span>Next-Gen Analytics Platform</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-gray-900 leading-tight mb-4 sm:mb-6">
                Transform CSV Data into{' '}
                <span className="text-blue-600">Powerful Insights</span>
              </h1>
              
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8 max-w-xl">
                Upload, visualize, and analyze your data in seconds. No coding required. 
                Built for analysts, managers, and teams who need fast, reliable insights.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
                <Link
                  to={user ? '/dashboard' : '/register'}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 transition-all duration-200 text-sm sm:text-base"
                >
                  {user ? 'Go to Dashboard' : 'Start Free Trial'}
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-semibold px-6 sm:px-8 py-3 sm:py-4 transition-all duration-200 text-sm sm:text-base"
                >
                  View Demo
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-gray-200">
                {stats.map((stat, idx) => (
                  <div key={idx}>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">{stat.value}</div>
                    <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Hero Image/Visual */}
            <div className="relative order-first lg:order-last">
              <div className="glass-card border-2 border-gray-200 p-6 sm:p-8 bg-white shadow-2xl">
                <div className="flex items-center gap-2 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
                  <BarChart3 size={20} className="text-blue-600" />
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">Live Dashboard Preview</span>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="h-24 sm:h-32 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 flex items-center justify-center">
                    <Activity size={40} className="text-blue-600 sm:w-12 sm:h-12" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="h-16 sm:h-20 bg-gray-50 border border-gray-200"></div>
                    <div className="h-16 sm:h-20 bg-gray-50 border border-gray-200"></div>
                    <div className="h-16 sm:h-20 bg-gray-50 border border-gray-200"></div>
                  </div>
                  <div className="h-20 sm:h-24 bg-gray-50 border border-gray-200"></div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 sm:w-32 sm:h-32 bg-blue-600 opacity-10 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Everything You Need to Analyze Data
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for modern data analysis. Simple enough for beginners, 
              powerful enough for experts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="glass-card border border-gray-200 p-5 sm:p-6 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-blue-50 border border-blue-200 flex items-center justify-center mb-3 sm:mb-4">
                  <feature.icon size={24} className="text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Dashify?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of teams who trust Dashify for their data analytics needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex gap-4 glass-card border border-gray-200 p-6 bg-white">
                <div className="w-12 h-12 bg-green-50 border border-green-200 flex items-center justify-center shrink-0">
                  <benefit.icon size={24} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by Data Professionals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our users have to say about Dashify.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="glass-card border border-gray-200 p-6 bg-white">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <Quote size={24} className="text-blue-200 mb-3" />
                <p className="text-sm text-gray-700 leading-relaxed mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div className="pt-4 border-t border-gray-200">
                  <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                  <div className="text-xs text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Transform Your Data?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who use Dashify to make better data-driven decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={user ? '/dashboard' : '/register'}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-blue-600 font-semibold px-8 py-4 transition-all duration-200"
            >
              Get Started Free
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-blue-700 border-2 border-white text-white font-semibold px-8 py-4 transition-all duration-200"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 sm:py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <BarChart3 size={24} className="text-blue-500" />
                <span className="text-lg sm:text-xl font-bold text-white">Dashify</span>
              </div>
              <p className="text-sm text-gray-500">
                Transform your CSV data into beautiful, actionable insights.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 sm:pt-8 border-t border-gray-800 text-center text-xs sm:text-sm">
            <p>&copy; {new Date().getFullYear()} Dashify. All rights reserved. Built with React, Tailwind CSS, and Supabase.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
