import React, { useState } from 'react'
import Navbar from '../components/common/Navbar'
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import emailService from '../services/emailService'

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Save to localStorage as backup
      emailService.saveToLocalStorage(formData)
      
      // Send email
      const result = await emailService.sendContactForm(formData)
      
      if (result.success) {
        toast.success(result.message)
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'support@dashify.com',
      link: 'mailto:support@dashify.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: '123 Data Street, San Francisco, CA 94102',
      link: '#'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Mon-Fri: 9AM - 6PM PST',
      link: '#'
    }
  ]

  const faqs = [
    {
      question: 'How quickly do you respond to inquiries?',
      answer: 'We typically respond to all inquiries within 24 hours during business days.'
    },
    {
      question: 'Do you offer phone support?',
      answer: 'Yes! Phone support is available for all paid plans. Free users can reach us via email.'
    },
    {
      question: 'Can I schedule a demo?',
      answer: 'Absolutely! Contact us to schedule a personalized demo with our team.'
    },
    {
      question: 'Do you offer enterprise solutions?',
      answer: 'Yes, we offer custom enterprise plans with dedicated support and advanced features.'
    }
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-gray-50 border-b border-gray-200 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, idx) => (
              <a
                key={idx}
                href={info.link}
                className="glass-card border border-gray-200 p-6 text-center hover:border-blue-300 hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                  <info.icon size={24} className="text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-sm text-gray-600">{info.content}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
                <p className="text-gray-600">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-4 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Info & FAQs */}
            <div className="space-y-8">
              {/* Why Contact Us */}
              <div className="glass-card border border-gray-200 p-8 bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare size={24} className="text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Why Contact Us?</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Get personalized product demos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Discuss enterprise solutions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Request custom integrations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Get technical support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Partner with us</span>
                  </li>
                </ul>
              </div>

              {/* FAQs */}
              <div className="glass-card border border-gray-200 p-8 bg-white">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="pb-4 border-b border-gray-200 last:border-0">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">{faq.question}</h4>
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Our Office</h2>
            <p className="text-lg text-gray-600">
              We're located in the heart of San Francisco. Drop by for a coffee!
            </p>
          </div>
          <div className="glass-card border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-br from-blue-50 to-gray-50 p-20 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={64} className="text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">123 Data Street</p>
                <p className="text-gray-600">San Francisco, CA 94102</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Dashify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default ContactPage
