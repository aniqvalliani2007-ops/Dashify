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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold mb-4">
            <Zap size={14} />
            <span>Simple Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Choose Your Plan
          </h1>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Start free and upgrade when you need unlimited power. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isCurrentPlan = currentTier === plan.tier
            const isHighlighted = plan.highlighted

            return (
              <div
                key={plan.tier}
                className={`relative ${isHighlighted ? 'pricing-card-pro' : 'pricing-card-free'}`}
              >
                {isHighlighted && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md text-[10px] font-bold shadow-sm">
                      <Crown size={10} />
                      POPULAR
                    </span>
                  </div>
                )}

                <div className="p-6">
                  {/* Icon & Name */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className={`p-2 rounded-md ${
                      isHighlighted 
                        ? 'bg-blue-100' 
                        : 'bg-gray-100'
                    }`}>
                      <Icon size={18} className={isHighlighted ? 'text-blue-600' : 'text-gray-600'} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-xs text-gray-500">{plan.description}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-500 text-xs">/ {plan.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className={`mt-0.5 p-0.5 rounded-full ${
                          isHighlighted 
                            ? 'bg-blue-100' 
                            : 'bg-gray-100'
                        }`}>
                          <Check size={12} className={
                            isHighlighted ? 'text-blue-600' : 'text-gray-600'
                          } />
                        </div>
                        <span className="text-xs text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleUpgrade(plan.tier)}
                    disabled={isCurrentPlan}
                    className={`w-full py-2.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                      isCurrentPlan
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isHighlighted
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-white border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900'
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
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-center text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            <div className="bg-white border border-gray-200 rounded-md p-5">
              <h3 className="font-semibold text-sm text-gray-900 mb-1.5">Can I upgrade or downgrade anytime?</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Yes! You can upgrade to Pro anytime. If you downgrade, you'll keep Pro features until the end of your billing period.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-md p-5">
              <h3 className="font-semibold text-sm text-gray-900 mb-1.5">What happens to my files if I downgrade?</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your existing files remain accessible. However, on the free tier, you won't be able to upload more than 3 files total.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-md p-5">
              <h3 className="font-semibold text-sm text-gray-900 mb-1.5">Do you offer refunds?</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Yes, we offer a 14-day money-back guarantee. If you're not satisfied, contact us for a full refund.
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 text-xs font-medium transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default PricingPage
