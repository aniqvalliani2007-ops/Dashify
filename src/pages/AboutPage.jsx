import React from 'react'
import Navbar from '../components/common/Navbar'
import { Target, Users, Award, TrendingUp, Heart, Globe, Zap, Shield } from 'lucide-react'

export const AboutPage = () => {
  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      desc: 'We believe data analysis should be accessible to everyone, not just data scientists.'
    },
    {
      icon: Users,
      title: 'User-Centric',
      desc: 'Every feature we build starts with understanding our users\' needs and challenges.'
    },
    {
      icon: Award,
      title: 'Excellence',
      desc: 'We strive for the highest quality in everything we do, from code to customer support.'
    },
    {
      icon: Heart,
      title: 'Passion',
      desc: 'We love what we do and it shows in the products we create and the service we provide.'
    }
  ]

  const team = [
    {
      name: 'Alex Thompson',
      role: 'CEO & Founder',
      bio: '15+ years in data analytics and enterprise software. Previously led product at DataCorp.'
    },
    {
      name: 'Sarah Martinez',
      role: 'CTO',
      bio: 'Former senior engineer at Google. Passionate about building scalable, secure systems.'
    },
    {
      name: 'David Kim',
      role: 'Head of Design',
      bio: 'Award-winning designer with a focus on creating intuitive, beautiful user experiences.'
    },
    {
      name: 'Emily Chen',
      role: 'VP of Engineering',
      bio: 'Led engineering teams at Microsoft and Amazon. Expert in cloud infrastructure.'
    }
  ]

  const milestones = [
    { year: '2021', event: 'Dashify Founded', desc: 'Started with a vision to democratize data analytics' },
    { year: '2022', event: '1,000 Users', desc: 'Reached our first thousand active users' },
    { year: '2023', event: 'Series A Funding', desc: 'Raised $10M to accelerate growth' },
    { year: '2024', event: '10K+ Users', desc: 'Serving over 10,000 professionals worldwide' }
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-gray-50 border-b border-gray-200 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            About Dashify
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make data analysis simple, fast, and accessible for everyone. 
            No coding required, no complex setup—just powerful insights at your fingertips.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 sm:py-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Our Story</h2>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                <p>
                  Dashify was born out of frustration. Our founders spent years working with data teams 
                  who struggled with complex tools that required extensive training and technical expertise.
                </p>
                <p>
                  We asked ourselves: "Why should analyzing a simple CSV file require a data science degree?" 
                  The answer was clear—it shouldn't.
                </p>
                <p>
                  In 2021, we set out to build a platform that anyone could use. A tool that would take 
                  minutes to learn, not months. A solution that would empower business users, analysts, 
                  and teams to make data-driven decisions without barriers.
                </p>
                <p>
                  Today, Dashify serves thousands of professionals across industries, from startups to 
                  Fortune 500 companies. But we're just getting started.
                </p>
              </div>
            </div>
            <div className="glass-card border border-gray-200 p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-white">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="text-center p-4 sm:p-6 bg-white border border-gray-200">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">10K+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Active Users</div>
                </div>
                <div className="text-center p-4 sm:p-6 bg-white border border-gray-200">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">1M+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Files Analyzed</div>
                </div>
                <div className="text-center p-4 sm:p-6 bg-white border border-gray-200">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">50+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Countries</div>
                </div>
                <div className="text-center p-4 sm:p-6 bg-white border border-gray-200">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                  <div className="text-xs sm:text-sm text-gray-600">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Dashify.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="glass-card border border-gray-200 p-6 bg-white text-center">
                <div className="w-16 h-16 bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-4">
                  <value.icon size={28} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Key milestones in the Dashify story.
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                <div className="w-24 shrink-0">
                  <div className="text-2xl font-bold text-blue-600">{milestone.year}</div>
                </div>
                <div className="flex-1 glass-card border border-gray-200 p-6 bg-white">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{milestone.event}</h3>
                  <p className="text-sm text-gray-600">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The talented people behind Dashify.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="glass-card border border-gray-200 p-6 bg-white text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-200 mx-auto mb-4 flex items-center justify-center">
                  <Users size={40} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <div className="text-sm text-blue-600 font-medium mb-3">{member.role}</div>
                <p className="text-xs text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Us on Our Mission</h2>
          <p className="text-lg text-blue-100 mb-8">
            Be part of the data revolution. Start analyzing your data today.
          </p>
          <a
            href="/register"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-blue-600 font-semibold px-8 py-4 transition-all duration-200"
          >
            Get Started Free
          </a>
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

export default AboutPage
