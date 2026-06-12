import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import { Calendar, Clock, Tag, ArrowLeft, Sparkles, TrendingUp, Shield, Database } from 'lucide-react'

export const ArticlePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Blog posts data - same as in BlogPage
  const blogPosts = [
    {
      id: 1,
      title: 'Introducing AI-Powered Data Insights',
      excerpt: 'We\'re excited to announce our new AI analyst feature that helps you understand your data better than ever before.',
      category: 'Product Updates',
      date: 'May 15, 2024',
      readTime: '5 min read',
      image: Sparkles,
      featured: true,
      content: `
        <h2>Revolutionizing Data Analysis with AI</h2>
        <p>
          We're excited to announce our new AI analyst feature that helps you understand your data better than ever before. 
          This groundbreaking technology uses advanced machine learning algorithms to automatically discover patterns, 
          anomalies, and insights in your data.
        </p>
        
        <h3>Key Features</h3>
        <ul>
          <li><strong>Automated Pattern Detection:</strong> Our AI automatically identifies trends and patterns you might miss</li>
          <li><strong>Anomaly Detection:</strong> Get alerts when unusual data points or trends emerge</li>
          <li><strong>Natural Language Insights:</strong> Receive insights in plain English, not just charts</li>
          <li><strong>Predictive Analytics:</strong> Forecast future trends based on historical data</li>
        </ul>

        <h3>How It Works</h3>
        <p>
          Simply upload your CSV file as you normally would, and our AI analyst will automatically:
        </p>
        <ol>
          <li>Analyze the structure and content of your data</li>
          <li>Identify key metrics and relationships</li>
          <li>Generate preliminary insights</li>
          <li>Create recommended visualizations</li>
          <li>Highlight areas worth investigating</li>
        </ol>

        <h3>Real-World Applications</h3>
        <p>
          Whether you're tracking sales metrics, monitoring customer behavior, or analyzing operational data, 
          the AI analyst can help you make faster, more informed decisions. Early users have reported:
        </p>
        <ul>
          <li>40% faster data analysis time</li>
          <li>Discovery of insights they previously missed</li>
          <li>Better decision-making with predictive forecasts</li>
        </ul>

        <p>
          Try the new AI analyst feature today and experience a whole new way to work with your data!
        </p>
      `
    },
    {
      id: 2,
      title: '10 Tips for Better Data Visualization',
      excerpt: 'Learn how to create charts that tell compelling stories and drive action in your organization.',
      category: 'Tutorials',
      date: 'May 10, 2024',
      readTime: '8 min read',
      image: TrendingUp,
      featured: false,
      content: `
        <h2>Master the Art of Data Visualization</h2>
        <p>
          Data visualization is more than just making charts look pretty. It's about telling a story with data, 
          guiding your audience to the right insights, and driving action. In this comprehensive guide, 
          we'll share 10 proven tips to elevate your data visualization skills.
        </p>

        <h3>Tip 1: Choose the Right Chart Type</h3>
        <p>
          Not all data should be visualized the same way. Line charts are great for showing trends over time, 
          bar charts excel at comparing values, and scatter plots reveal relationships between variables. 
          Match your chart type to your data story.
        </p>

        <h3>Tip 2: Simplify Your Design</h3>
        <p>
          Remove unnecessary elements. Every color, line, and label should have a purpose. 
          A clean, simple visualization is more powerful than one cluttered with unnecessary details.
        </p>

        <h3>Tip 3: Use Color Strategically</h3>
        <p>
          Limit your color palette to 3-4 colors maximum. Use color to highlight important data or categories, 
          not to decorate. Consider color-blind friendly palettes for accessibility.
        </p>

        <h3>Tip 4: Add Context</h3>
        <p>
          Include titles, axis labels, and legends. Provide units and scales so your audience understands what they're looking at.
        </p>

        <h3>Tip 5: Focus on the Key Message</h3>
        <p>
          What's the most important insight? Make sure your visualization draws attention to it first.
        </p>

        <h3>Tip 6: Use Consistent Scales</h3>
        <p>
          When comparing multiple charts, use the same scale for fair comparison. Inconsistent scales can mislead your audience.
        </p>

        <h3>Tip 7: Add Annotations</h3>
        <p>
          Mark important points, trends, or changes directly on your chart. Help your audience understand what they're seeing.
        </p>

        <h3>Tip 8: Consider Your Audience</h3>
        <p>
          Tailor your visualization to your audience's technical level and interests. Executives want high-level summaries; analysts want details.
        </p>

        <h3>Tip 9: Test for Accessibility</h3>
        <p>
          Ensure your visualizations are readable for people with color blindness and can be understood without relying solely on color.
        </p>

        <h3>Tip 10: Iterate and Get Feedback</h3>
        <p>
          Show your visualizations to others and ask for feedback. What's obvious to you might not be to others.
        </p>

        <p>
          By following these tips, you'll create visualizations that not only look great but also effectively communicate your data story.
        </p>
      `
    },
    {
      id: 3,
      title: 'How We Built Enterprise-Grade Security',
      excerpt: 'A deep dive into our security architecture and how we protect your sensitive data.',
      category: 'Company News',
      date: 'May 5, 2024',
      readTime: '6 min read',
      image: Shield,
      featured: false,
      content: `
        <h2>Security at the Core</h2>
        <p>
          At Dashify, we understand that your data is precious. That's why security isn't an afterthought—it's built into 
          every layer of our platform. In this article, we'll walk you through our security architecture and explain 
          how we protect your sensitive information.
        </p>

        <h3>End-to-End Encryption</h3>
        <p>
          All data in transit between your device and our servers is encrypted using industry-standard TLS 1.3. 
          Your data is encrypted at rest using AES-256, one of the strongest encryption standards available.
        </p>

        <h3>Role-Based Access Control</h3>
        <p>
          Every user has specific permissions based on their role. Admin roles can manage users and settings, 
          analysts can view and create reports, and viewers have read-only access. You control exactly who can see what.
        </p>

        <h3>Row-Level Security</h3>
        <p>
          With Supabase's row-level security policies, we ensure that users can only access data they're authorized to see. 
          Even if someone gains unauthorized database access, the RLS policies prevent them from seeing other users' data.
        </p>

        <h3>Regular Security Audits</h3>
        <p>
          We conduct regular security audits and penetration testing to identify and fix vulnerabilities before they become problems.
        </p>

        <h3>Compliance & Standards</h3>
        <p>
          We comply with GDPR, CCPA, and other data privacy regulations. Our infrastructure meets SOC 2 Type II standards.
        </p>

        <h3>Zero-Knowledge Architecture</h3>
        <p>
          We can't access your data. Our infrastructure is designed so that only you and authorized users can decrypt your data.
        </p>

        <p>
          Your trust is everything to us, and we take security seriously at every level of our platform.
        </p>
      `
    },
    {
      id: 4,
      title: 'Understanding Data Aggregation Methods',
      excerpt: 'A comprehensive guide to sum, average, count, and other aggregation techniques.',
      category: 'Data Analytics',
      date: 'April 28, 2024',
      readTime: '7 min read',
      image: Database,
      featured: false,
      content: `
        <h2>Mastering Data Aggregation</h2>
        <p>
          Data aggregation is one of the most powerful tools in analytics. It allows you to summarize large datasets 
          into meaningful metrics. Let's explore the most common aggregation methods and when to use each one.
        </p>

        <h3>SUM</h3>
        <p>
          The SUM function adds all values in a column. Use it for calculating total revenue, total units sold, or total hours worked.
        </p>

        <h3>AVG (Average)</h3>
        <p>
          Calculates the mean of all values. Useful for finding average order value, average customer satisfaction, or average response time.
        </p>

        <h3>COUNT</h3>
        <p>
          Counts the number of records. Use COUNT to find how many customers you have, how many transactions occurred, or how many employees work in each department.
        </p>

        <h3>MIN and MAX</h3>
        <p>
          MIN finds the smallest value, MAX finds the largest. Perfect for finding minimum/maximum prices, earliest/latest dates, or smallest/largest orders.
        </p>

        <h3>GROUP BY</h3>
        <p>
          GROUP BY allows you to aggregate data by categories. Group sales by region to see which regions perform best. 
          Group transactions by month to see seasonal trends.
        </p>

        <h3>PERCENTILE</h3>
        <p>
          Calculate percentiles to find thresholds. For example, the 90th percentile salary, or the 95th percentile customer lifetime value.
        </p>

        <h3>Combining Aggregations</h3>
        <p>
          The most powerful analysis comes from combining multiple aggregation methods. 
          For example: "Find the average (AVG) order value (SUM / COUNT) by region (GROUP BY) for the top 10% (PERCENTILE) of customers."
        </p>

        <p>
          Master these aggregation techniques, and you'll unlock powerful insights from your data.
        </p>
      `
    },
    {
      id: 5,
      title: 'Dashify Reaches 10,000 Active Users',
      excerpt: 'Celebrating a major milestone and thanking our amazing community for their support.',
      category: 'Company News',
      date: 'April 20, 2024',
      readTime: '4 min read',
      image: TrendingUp,
      featured: false,
      content: `
        <h2>A Milestone Worth Celebrating</h2>
        <p>
          Today, we're thrilled to announce that Dashify has reached 10,000 active users! 
          This incredible milestone wouldn't have been possible without the support of our amazing community.
        </p>

        <h3>From Idea to 10K Users</h3>
        <p>
          When we started Dashify, our goal was simple: make data analysis accessible to everyone. 
          We've been overwhelmed by the response and the incredible feedback from our users.
        </p>

        <h3>What's Next?</h3>
        <p>
          As we celebrate this milestone, we're already hard at work on the next generation of features:
        </p>
        <ul>
          <li>Advanced AI-powered insights</li>
          <li>Real-time collaboration features</li>
          <li>Integration with your favorite tools</li>
          <li>Mobile app for on-the-go analysis</li>
        </ul>

        <h3>Thank You</h3>
        <p>
          Thank you to our users, our team, and our investors for believing in the vision. 
          We're excited to continue building the best data analysis platform out there.
        </p>

        <p>
          Here's to the next 10,000 users! Join us on this incredible journey.
        </p>
      `
    },
    {
      id: 6,
      title: 'CSV Best Practices for Data Analysis',
      excerpt: 'Tips for structuring your CSV files to get the most out of Dashify and other analytics tools.',
      category: 'Tutorials',
      date: 'April 15, 2024',
      readTime: '6 min read',
      image: Database,
      featured: false,
      content: `
        <h2>CSV Files Done Right</h2>
        <p>
          CSV files are the backbone of data analysis. But not all CSV files are created equal. 
          In this guide, we'll share best practices for structuring your CSV files to get the most value from your analysis.
        </p>

        <h3>Use Meaningful Column Headers</h3>
        <p>
          Make your headers clear and descriptive. Instead of "col1" or "data", use "Customer_Name" or "Revenue_USD". 
          This makes your data self-documenting and easier to work with.
        </p>

        <h3>Choose Consistent Formats</h3>
        <p>
          Keep date formats consistent throughout your file. Use ISO 8601 format (YYYY-MM-DD) for dates. 
          Use consistent number formats and currency symbols.
        </p>

        <h3>Avoid Special Characters</h3>
        <p>
          Keep column names simple. Avoid spaces, special characters, and very long names. Use underscores instead of spaces.
        </p>

        <h3>Handle Missing Data Properly</h3>
        <p>
          Use a consistent approach for missing data. Either leave cells empty or use "NULL" consistently. 
          Don't use question marks, "N/A", or "-" inconsistently.
        </p>

        <h3>One Table Per File</h3>
        <p>
          Don't mix different datasets in one CSV file. Keep one table per file with related data only.
        </p>

        <h3>Use Proper Encoding</h3>
        <p>
          Save your CSV files as UTF-8 to ensure special characters are preserved correctly.
        </p>

        <h3>Remove Extra Spaces</h3>
        <p>
          Trim leading and trailing spaces from all cells. Extra spaces can cause data inconsistencies.
        </p>

        <p>
          Follow these best practices, and you'll have cleaner data that's ready for analysis.
        </p>
      `
    }
  ]

  const post = blogPosts.find(p => p.id === parseInt(id))

  if (!post) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex flex-col">
        <Navbar />
        <section className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">Sorry, we couldn't find the article you're looking for.</p>
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 transition-all duration-200"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-gray-50 border-b border-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </button>
          <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold mb-4">
            <Tag size={12} />
            {post.category}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap">
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {post.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} />
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="flex-1 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          {/* Featured Image */}
          <div className="mb-12 glass-card border border-gray-200 p-12 bg-white flex items-center justify-center rounded-lg">
            <post.image size={120} className="text-blue-600" />
          </div>

          {/* Article Body */}
          <div className="bg-white rounded-lg border border-gray-200 p-10 shadow-sm">
            <div className="prose-custom space-y-8">
              <style>{`
                .prose-custom h2 {
                  font-size: 1.875rem;
                  font-weight: 700;
                  color: #111827;
                  margin-top: 2rem;
                  margin-bottom: 1rem;
                  line-height: 1.2;
                }
                
                .prose-custom h2:first-child {
                  margin-top: 0;
                }
                
                .prose-custom h3 {
                  font-size: 1.25rem;
                  font-weight: 600;
                  color: #1e40af;
                  margin-top: 1.5rem;
                  margin-bottom: 0.75rem;
                  line-height: 1.4;
                }
                
                .prose-custom p {
                  font-size: 1rem;
                  color: #374151;
                  line-height: 1.75;
                  margin-bottom: 1rem;
                }
                
                .prose-custom ul, .prose-custom ol {
                  margin: 1.5rem 0;
                  padding-left: 2rem;
                }
                
                .prose-custom li {
                  color: #374151;
                  line-height: 1.75;
                  margin-bottom: 0.75rem;
                  font-size: 1rem;
                }
                
                .prose-custom li strong {
                  color: #111827;
                  font-weight: 600;
                }
                
                .prose-custom ul li {
                  list-style-type: disc;
                }
                
                .prose-custom ol li {
                  list-style-type: decimal;
                }
              `}</style>
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>

          {/* Article Footer - Meta Info */}
          <div className="mt-12 bg-white rounded-lg border border-gray-200 p-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Article Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border-l-4 border-blue-600 pl-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Category</p>
                <p className="text-lg font-semibold text-gray-900">{post.category}</p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Published</p>
                <p className="text-lg font-semibold text-gray-900">{post.date}</p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Reading Time</p>
                <p className="text-lg font-semibold text-gray-900">{post.readTime}</p>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg border border-blue-200 p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Want to see more insights?
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Check out our blog for more tutorials, tips, and updates about data analytics and Dashify.
            </p>
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 transition-all duration-200 rounded"
            >
              View All Articles
              <ArrowLeft size={16} className="rotate-180" />
            </button>
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

export default ArticlePage
