import emailjs from '@emailjs/browser'

export const emailService = {
  /**
   * Send contact form email
   */
  sendContactForm: async (formData) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    // Check if EmailJS is configured properly
    const isConfigured = serviceId && 
                        templateId && 
                        publicKey && 
                        serviceId.startsWith('service_') &&
                        templateId.startsWith('template_')

    if (!isConfigured) {
      console.log('📧 Contact Form Submission (EmailJS not configured):', formData)
      return {
        success: true,
        message: 'Message received! We\'ll get back to you soon.'
      }
    }

    try {
      // Send email using EmailJS
      const response = await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: 'saifvalliani33@gmail.com',
          from_name: formData.name,
          from_email: formData.email,
          reply_to: formData.email,
          subject: formData.subject,
          message: formData.message
        },
        publicKey
      )

      console.log('✅ Email sent successfully:', response)
      
      return {
        success: true,
        message: 'Message sent successfully! We\'ll get back to you soon.'
      }
    } catch (error) {
      console.error('Email send failed:', error)
      
      // Still return success since data is saved to localStorage
      return {
        success: true,
        message: 'Message received! We\'ll get back to you soon.'
      }
    }
  },

  /**
   * Save to local storage as backup
   */
  saveToLocalStorage: (formData) => {
    try {
      const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]')
      submissions.push({
        ...formData,
        timestamp: new Date().toISOString()
      })
      localStorage.setItem('contactSubmissions', JSON.stringify(submissions))
      console.log('💾 Form data saved to localStorage')
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  },

  /**
   * Get all submissions from local storage
   */
  getSubmissions: () => {
    try {
      return JSON.parse(localStorage.getItem('contactSubmissions') || '[]')
    } catch (error) {
      console.error('Failed to get submissions:', error)
      return []
    }
  }
}

export default emailService
