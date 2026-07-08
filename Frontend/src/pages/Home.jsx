import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Briefcase, Star, Users, TrendingUp, CheckCircle } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-dark-text-primary mb-6 leading-tight">
                Your Local <span className="text-brand-600 dark:text-dark-brand">Marketplace</span> & <span className="text-accent-500 dark:text-dark-accent">Services</span> Hub
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-dark-text-secondary mb-8 max-w-xl mx-auto lg:mx-0">
                Discover amazing products from your neighbors and connect with skilled professionals. Buy, sell, and get things done — all in one trusted community. Whether you're looking for a vintage camera, a reliable plumber, or a web developer, we make it easy to find what you need with verified providers and secure payments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-brand-600 hover:bg-brand-700 dark:bg-dark-brand dark:hover:bg-dark-brand-hover text-white dark:text-dark-bg font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-brand-500/25"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Explore Marketplace
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-dark-surface border-2 border-brand-600 dark:border-dark-brand text-brand-600 dark:text-dark-brand font-semibold rounded-xl transition-all hover:bg-brand-50 dark:hover:bg-dark-brand/10"
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  Browse Services
                </Link>
              </div>

              {/* Trust Stats */}
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-dark-border">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-brand-600 dark:text-dark-brand">500+</div>
                    <div className="text-sm text-slate-500 dark:text-dark-text-secondary">Active Providers</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-accent-500 dark:text-dark-accent">1,200+</div>
                    <div className="text-sm text-slate-500 dark:text-dark-text-secondary">Listings</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-1">
                      <span className="text-3xl font-bold text-accent-500 dark:text-dark-accent">4.8</span>
                      <Star className="w-6 h-6 fill-accent-500 text-accent-500 dark:fill-dark-accent dark:text-dark-accent" />
                    </div>
                    <div className="text-sm text-slate-500 dark:text-dark-text-secondary">Avg Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual Element */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white dark:bg-dark-surface dark:border dark:border-dark-border rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="aspect-video bg-gradient-to-br from-brand-100 to-brand-200 dark:from-dark-surface dark:to-dark-surface-elevated rounded-lg mb-4 flex items-center justify-center">
                    <ShoppingCart className="w-16 h-16 text-brand-600 dark:text-dark-brand" />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-brand-100 dark:bg-dark-surface-elevated rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-brand-600 dark:text-dark-brand" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-dark-text-primary">Vintage Camera Set</div>
                      <div className="text-sm text-slate-500 dark:text-dark-text-secondary">Electronics • Used</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-brand-600 dark:text-dark-brand">$450</div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent-500 text-accent-500 dark:fill-dark-accent dark:text-dark-accent" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                </div>

                {/* Floating Service Card */}
                <div className="absolute -top-8 -right-8 bg-white dark:bg-dark-surface dark:border dark:border-dark-border rounded-xl shadow-xl p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent-100 dark:bg-dark-surface-elevated rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-accent-500 dark:text-dark-accent" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-dark-text-primary text-sm">Web Development</div>
                      <div className="text-xs text-slate-500 dark:text-dark-text-secondary">From $500</div>
                    </div>
                  </div>
                </div>

                {/* Floating Rating Badge */}
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-dark-surface dark:border dark:border-dark-border rounded-xl shadow-xl p-3 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent-500 text-accent-500 dark:fill-dark-accent dark:text-dark-accent" />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-dark-text-primary">5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Strip Section */}
      <section className="py-16 bg-white dark:bg-dark-surface border-y border-transparent dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-dark-text-primary mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Full-Stack Web Development', icon: '💻', color: 'bg-blue-100 text-blue-600', desc: 'React, Node.js & Custom APIs' },
              { name: 'Graphic Design & Branding', icon: '🎨', color: 'bg-purple-100 text-purple-600', desc: 'Logos, UI/UX & Marketing' },
              { name: 'Home Repair Services', icon: '🏠', color: 'bg-green-100 text-green-600', desc: 'Plumbing, Electrical & More' },
              { name: 'Academic Tutoring', icon: '📚', color: 'bg-yellow-100 text-yellow-600', desc: 'Math, Science & Languages' },
              { name: 'Electronics & Gadgets', icon: '📱', color: 'bg-red-100 text-red-600', desc: 'Phones, Laptops & Accessories' },
              { name: 'Furniture & Home Decor', icon: '🪑', color: 'bg-orange-100 text-orange-600', desc: 'Sofas, Tables & Artwork' },
            ].map((category, index) => (
              <Link
                key={index}
                to="/products"
                className="group flex flex-col items-center p-4 sm:p-6 bg-slate-50 dark:bg-dark-bg rounded-xl hover:bg-brand-50 dark:hover:bg-dark-surface-elevated border border-transparent dark:border-dark-border dark:hover:border-dark-brand/30 transition-all hover:shadow-lg"
              >
                <span className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">{category.icon}</span>
                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-dark-text-primary text-center">{category.name}</span>
                <span className="text-xs text-slate-500 dark:text-dark-text-secondary text-center mt-1">{category.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-dark-text-primary">Featured Listings</h2>
            <Link to="/products" className="text-brand-600 dark:text-dark-brand hover:text-brand-700 dark:hover:text-dark-brand-hover font-medium flex items-center">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Vintage Canon AE-1 Camera Set', price: 450, rating: 4.8, seller: 'John D.', image: '📷', condition: 'Excellent', location: 'Downtown' },
              { title: 'Modern Oak Office Desk', price: 200, rating: 4.5, seller: 'Jane S.', image: '🪑', condition: 'Like New', location: 'Westside' },
              { title: 'ASUS ROG Gaming Laptop', price: 1200, rating: 5.0, seller: 'Bob J.', image: '💻', condition: 'New', location: 'Tech District' },
              { title: 'Trek Mountain Bike', price: 350, rating: 4.7, seller: 'Alice W.', image: '🚴', condition: 'Good', location: 'Eastside' },
            ].map((item, index) => (
              <Link key={index} to="/products" className="group">
                <div className="bg-white dark:bg-dark-surface dark:border dark:border-dark-border rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-dark-surface dark:to-dark-surface-elevated flex items-center justify-center text-6xl">
                    {item.image}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 dark:text-dark-text-primary mb-1 truncate">{item.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-dark-text-secondary mb-2">{item.condition} • {item.location}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-brand-600 dark:text-dark-brand">${item.price}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent-500 text-accent-500 dark:fill-dark-accent dark:text-dark-accent" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-dark-text-secondary mt-2">by {item.seller}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-dark-surface border-y border-transparent dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-dark-text-primary mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Browse & Discover', desc: 'Explore hundreds of local products and services from trusted community members. Filter by category, location, price, and ratings to find exactly what you need. Read detailed descriptions and reviews before making your choice.' },
              { step: '02', title: 'Book or Buy', desc: 'Purchase products directly through our secure payment system or book services with flexible scheduling. For services, communicate your requirements upfront and agree on deliverables before payment. Your money is held safely until the work is completed.' },
              { step: '03', title: 'Chat & Get It Done', desc: 'Use our built-in messaging to coordinate with sellers and service providers. Track your order status, share files, and get real-time updates. Once your service is complete or product delivered, leave a review to help others in the community.' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-brand-100 dark:bg-dark-bg/60 dark:border dark:border-dark-border rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-brand-600 dark:text-dark-brand">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-dark-text-primary mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-dark-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-dark-text-primary mb-8 text-center">What Our Community Says</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah Ahmed', role: 'Small Business Owner, Lahore', rating: 5, text: 'I needed a professional website for my bakery but couldn\'t afford agency prices. Found an amazing web developer here who understood my vision perfectly. The process was smooth, communication was excellent, and the final quality exceeded my expectations. My online orders have tripled since launch!' },
              { name: 'Michael Roberts', role: 'Freelance Designer, Karachi', rating: 5, text: 'Sold my old furniture in just 2 days when I was moving apartments. The community here is trustworthy and responsive — I got multiple genuine inquiries and the buyer was punctual for pickup. Much better than dealing with strangers on other platforms.' },
              { name: 'Emily Khan', role: 'Student, Islamabad', rating: 4, text: 'Found an excellent math tutor through this platform when I was struggling with calculus. The hourly rates were reasonable compared to private coaching centers, and being able to read reviews from other students gave me confidence in my choice. Great for finding specialized help!' },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-dark-surface dark:border dark:border-dark-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent-500 text-accent-500 dark:fill-dark-accent dark:text-dark-accent" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-dark-text-secondary mb-4 text-sm leading-relaxed">"{testimonial.text}"</p>
                <p className="font-semibold text-slate-900 dark:text-dark-text-primary text-sm">— {testimonial.name}</p>
                <p className="text-xs text-slate-500 dark:text-dark-text-secondary">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Platform Section */}
      <section className="py-16 bg-white dark:bg-dark-surface border-y border-transparent dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-dark-text-primary mb-8 text-center">About Smart Community Marketplace</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-600 dark:text-dark-text-secondary text-lg leading-relaxed mb-6">
              Smart Community Marketplace was built to solve a simple problem: finding trusted local services and quality second-hand products shouldn't require scrolling through dozens of Facebook groups or relying on word-of-mouth recommendations. We're creating a transparent, review-based marketplace where your community members become your trusted network.
            </p>
            <p className="text-slate-600 dark:text-dark-text-secondary text-lg leading-relaxed mb-6">
              Whether you're a small business owner looking for affordable web development, a student seeking a math tutor, or someone moving apartments who needs to sell furniture quickly — our platform connects you with verified providers and genuine buyers in your area. Every provider is vetted, every transaction is secure, and every review helps build trust in the community.
            </p>
            <p className="text-slate-600 dark:text-dark-text-secondary text-lg leading-relaxed">
              We believe in the power of local communities. By keeping commerce and services within the neighborhood, we not only save money but also build relationships that last. Join thousands of users who have already discovered a better way to buy, sell, and get things done.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-dark-text-primary mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How do I know a provider is trustworthy?',
                a: 'Every service provider on our platform goes through a verification process including identity confirmation and skills assessment. Additionally, all providers have public reviews and ratings from previous clients, so you can see their track record before booking. We also hold payments in escrow until the service is completed to your satisfaction.'
              },
              {
                q: 'What happens if I\'m not satisfied with a service?',
                a: 'If a service doesn\'t meet the agreed-upon deliverables or quality standards, you can request a revision directly through our messaging system. Most providers offer 1-2 free revisions. If the issue cannot be resolved, you can open a dispute within 7 days of delivery, and our support team will mediate to find a fair solution, including potential refunds.'
              },
              {
                q: 'Can I sell products and offer services at the same time?',
                a: 'Absolutely! Many of our community members do both. You can list products in the marketplace section and offer services in the services section using the same account. Your profile will show both your product listings and service offerings, making it easy for buyers to see everything you provide.'
              },
              {
                q: 'Is there a fee to join the platform?',
                a: 'Creating an account and browsing listings is completely free. For sellers, we charge a small 5% commission on successful product sales. For service providers, there\'s a 10% service fee on completed bookings. There are no monthly subscriptions or hidden fees — you only pay when you make a sale.'
              },
              {
                q: 'How are payments handled?',
                a: 'All payments are processed securely through our platform. When you book a service, the payment is held in escrow until the provider delivers the work. For products, payment is released to the seller once you confirm receipt and are satisfied with the item. This protects both buyers and sellers throughout the transaction.'
              },
              {
                q: 'Can I communicate with providers before booking?',
                a: 'Yes! We encourage you to message providers before booking to discuss your requirements, timeline, and any questions you might have. Use our built-in messaging system to share files, clarify details, and ensure you and the provider are on the same page before making any commitments.'
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white dark:bg-dark-surface dark:border dark:border-dark-border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900 dark:text-dark-text-primary mb-2">{faq.q}</h3>
                <p className="text-slate-600 dark:text-dark-text-secondary text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="py-16 bg-gradient-to-r from-brand-600 to-brand-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Join the Community Today</h2>
          <p className="text-brand-100 text-lg mb-8 max-w-2xl mx-auto">
            Connect with your neighbors, discover great deals, and get things done with trusted local professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-600 font-semibold rounded-xl transition-all hover:bg-brand-50 shadow-lg"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-700 hover:bg-brand-800 dark:bg-dark-bg/20 dark:hover:bg-dark-bg/40 border-2 border-brand-500 dark:border-dark-brand dark:text-white font-semibold rounded-xl transition-all"
            >
              Explore Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
