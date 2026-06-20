import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Check, Sparkles, Zap, Crown } from 'lucide-react'
import { Button } from '../components/common/Button'

export const PricingPage = () => {
  const navigate = useNavigate()
  const { user, subscription } = useAuth()

  const currentTier = subscription?.subscription_tier || 'free'

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out Dashify',
      icon: Sparkles,
      features: [
        'Upload up to 3 CSV files',
        'Basic chart visualizations',
        'AI-powered insights',
        'Export dashboards',
        'Community support'
      ],
      cta: 'Current Plan',
      tier: 'free',
      highlighted: false
    },
    {
      name: 'Pro',
      price: '$12',
      period: 'per month',
      description: 'Unlimited power for professionals',
      icon: Crown,
      features: [
        'Unlimited CSV uploads',
        'Advanced chart types',
        'Priority AI responses',
        'Custom branding',
        'Advanced data transformations',
        'Export to multiple formats',
        'Priority support',
        'Early access to new features'
      ],
      cta: 'Upgrade to Pro',
      tier: 'pro',
      highlighted: true
    }
  ]

  const handleUpgrade = (tier) => {
    if (!user) {
      navigate('/login')
      return
    }
    if (tier === 'free') return
    
    // TODO: Integrate with payment provider (Stripe, Paddle, etc.)
    alert('Payment integration coming soon! This will redirect to checkout.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg shadow-blue-500/25">
            <Zap size={16} />
            <span>Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade when you need unlimited power. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isCurrentPlan = currentTier === plan.tier
            const isHighlighted = plan.highlighted

            return (
              <div
                key={plan.tier}
                className={`relative pricing-card ${isHighlighted ? 'highlighted' : ''}`}
              >
                {isHighlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      <Crown size={12} />
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Icon & Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-xl ${
                      isHighlighted 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30' 
                        : 'bg-gradient-to-br from-gray-100 to-gray-200'
                    }`}>
                      <Icon size={24} className={isHighlighted ? 'text-white' : 'text-gray-600'} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-500">{plan.description}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-500 text-sm">/ {plan.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1 rounded-full ${
                          isHighlighted 
                            ? 'bg-blue-100' 
                            : 'bg-gray-100'
                        }`}>
                          <Check size={14} className={
                            isHighlighted ? 'text-blue-600' : 'text-gray-600'
                          } />
                        </div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleUpgrade(plan.tier)}
                    disabled={isCurrentPlan}
                    className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 ${
                      isCurrentPlan
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isHighlighted
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40'
                        : 'bg-white border-2 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    {isCurrentPlan ? '✓ Current Plan' : plan.cta}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="pricing-card p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade anytime?</h3>
              <p className="text-sm text-gray-600">
                Yes! You can upgrade to Pro anytime. If you downgrade, you'll keep Pro features until the end of your billing period.
              </p>
            </div>
            <div className="pricing-card p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What happens to my files if I downgrade?</h3>
              <p className="text-sm text-gray-600">
                Your existing files remain accessible. However, on the free tier, you won't be able to upload more than 3 files total.
              </p>
            </div>
            <div className="pricing-card p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-sm text-gray-600">
                Yes, we offer a 14-day money-back guarantee. If you're not satisfied, contact us for a full refund.
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default PricingPage
