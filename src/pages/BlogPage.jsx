import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import { Calendar, Clock, ArrowRight, Tag, TrendingUp, Sparkles, Database, Shield } from 'lucide-react'

export const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const navigate = useNavigate()

  const categories = ['All', 'Product Updates', 'Data Analytics', 'Tutorials', 'Company News']

  const blogPosts = [
    {
      id: 1,
      title: 'Introducing AI-Powered Data Insights',
      excerpt: 'We\'re excited to announce our new AI analyst feature that helps you understand your data better than ever before.',
      category: 'Product Updates',
      date: 'May 15, 2024',
      readTime: '5 min read',
      image: Sparkles,
      featured: true
    },
    {
      id: 2,
      title: '10 Tips for Better Data Visualization',
      excerpt: 'Learn how to create charts that tell compelling stories and drive action in your organization.',
      category: 'Tutorials',
      date: 'May 10, 2024',
      readTime: '8 min read',
      image: TrendingUp,
      featured: false
    },
    {
      id: 3,
      title: 'How We Built Enterprise-Grade Security',
      excerpt: 'A deep dive into our security architecture and how we protect your sensitive data.',
      category: 'Company News',
      date: 'May 5, 2024',
      readTime: '6 min read',
      image: Shield,
      featured: false
    },
    {
      id: 4,
      title: 'Understanding Data Aggregation Methods',
      excerpt: 'A comprehensive guide to sum, average, count, and other aggregation techniques.',
      category: 'Data Analytics',
      date: 'April 28, 2024',
      readTime: '7 min read',
      image: Database,
      featured: false
    },
    {
      id: 5,
      title: 'Dashify Reaches 10,000 Active Users',
      excerpt: 'Celebrating a major milestone and thanking our amazing community for their support.',
      category: 'Company News',
      date: 'April 20, 2024',
      readTime: '4 min read',
      image: TrendingUp,
      featured: false
    },
    {
      id: 6,
      title: 'CSV Best Practices for Data Analysis',
      excerpt: 'Tips for structuring your CSV files to get the most out of Dashify and other analytics tools.',
      category: 'Tutorials',
      date: 'April 15, 2024',
      readTime: '6 min read',
      image: Database,
      featured: false
    }
  ]

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)

  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-gray-50 border-b border-gray-200 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Dashify Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Insights, tutorials, and updates from the Dashify team. Learn how to make the most 
            of your data and stay up to date with the latest features.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="glass-card border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold mb-4">
                    <Sparkles size={12} />
                    Featured Post
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {featuredPost.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag size={14} />
                      {featuredPost.category}
                    </span>
                  </div>
                  <a
                    onClick={() => navigate(`/blog/${featuredPost.id}`)}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 transition-all duration-200 cursor-pointer"
                  >
                    Read Article
                    <ArrowRight size={16} />
                  </a>
                </div>
                <div className="glass-card border border-gray-200 p-12 bg-white flex items-center justify-center">
                  <featuredPost.image size={120} className="text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {regularPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600">No posts found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article key={post.id} className="glass-card border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all group">
                  <div className="bg-gradient-to-br from-blue-50 to-gray-50 p-12 flex items-center justify-center border-b border-gray-200">
                    <post.image size={64} className="text-blue-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold mb-3">
                      <Tag size={12} />
                      {post.category}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-200">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.readTime}
                      </span>
                    </div>
                    <a
                      onClick={() => navigate(`/blog/${post.id}`)}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors cursor-pointer"
                    >
                      Read More
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Subscribe to our newsletter for the latest updates, tips, and insights.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 transition-all duration-200"
            >
              Subscribe
            </button>
          </form>
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

export default BlogPage
