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
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                Your Local <span className="text-brand-600">Marketplace</span> & <span className="text-accent-500">Services</span> Hub
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0">
                Discover amazing products from your neighbors and connect with skilled professionals. Buy, sell, and get things done — all in one trusted community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-brand-500/25"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Explore Marketplace
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-dark-surface border-2 border-brand-600 text-brand-600 dark:text-brand-400 font-semibold rounded-xl transition-all hover:bg-brand-50 dark:hover:bg-brand-900/20"
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  Browse Services
                </Link>
              </div>

              {/* Trust Stats */}
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-dark-border">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-brand-600">500+</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Active Providers</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-accent-500">1,200+</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Listings</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-1">
                      <span className="text-3xl font-bold text-accent-500">4.8</span>
                      <Star className="w-6 h-6 fill-accent-500 text-accent-500" />
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Avg Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual Element */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="aspect-video bg-gradient-to-br from-brand-100 to-brand-200 rounded-lg mb-4 flex items-center justify-center">
                    <ShoppingCart className="w-16 h-16 text-brand-600" />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Vintage Camera Set</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Electronics • Used</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-brand-600">$450</div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent-500 text-accent-500" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                </div>

                {/* Floating Service Card */}
                <div className="absolute -top-8 -right-8 bg-white dark:bg-dark-surface rounded-xl shadow-xl p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-accent-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-sm">Web Development</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">From $500</div>
                    </div>
                  </div>
                </div>

                {/* Floating Rating Badge */}
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-dark-surface rounded-xl shadow-xl p-3 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent-500 text-accent-500" />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Strip Section */}
      <section className="py-16 bg-white dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Web Development', icon: '💻', color: 'bg-blue-100 text-blue-600' },
              { name: 'Graphic Design', icon: '🎨', color: 'bg-purple-100 text-purple-600' },
              { name: 'Home Services', icon: '🏠', color: 'bg-green-100 text-green-600' },
              { name: 'Tutoring', icon: '📚', color: 'bg-yellow-100 text-yellow-600' },
              { name: 'Electronics', icon: '📱', color: 'bg-red-100 text-red-600' },
              { name: 'Furniture', icon: '🪑', color: 'bg-orange-100 text-orange-600' },
            ].map((category, index) => (
              <Link
                key={index}
                to="/products"
                className="group flex flex-col items-center p-6 bg-slate-50 dark:bg-dark-bg rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all hover:shadow-lg"
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Listings</h2>
            <Link to="/products" className="text-brand-600 hover:text-brand-700 font-medium flex items-center">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Vintage Camera Collection', price: 450, rating: 4.8, seller: 'John D.', image: '📷' },
              { title: 'Modern Office Desk', price: 200, rating: 4.5, seller: 'Jane S.', image: '🪑' },
              { title: 'Gaming Laptop', price: 1200, rating: 5.0, seller: 'Bob J.', image: '💻' },
              { title: 'Mountain Bike', price: 350, rating: 4.7, seller: 'Alice W.', image: '🚴' },
            ].map((item, index) => (
              <Link key={index} to="/products" className="group">
                <div className="bg-white dark:bg-dark-surface rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-dark-border dark:to-dark-surface flex items-center justify-center text-6xl">
                    {item.image}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1 truncate">{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-brand-600">${item.price}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent-500 text-accent-500" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">by {item.seller}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Browse & Discover', desc: 'Explore hundreds of local products and services from trusted community members.' },
              { step: '02', title: 'Book or Buy', desc: 'Purchase products directly or book services with secure payments and scheduling.' },
              { step: '03', title: 'Chat & Get It Done', desc: 'Communicate with sellers and providers, track progress, and get things done.' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">What Our Community Says</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah M.', rating: 5, text: 'Found an amazing web developer here. The process was smooth and the quality exceeded my expectations!' },
              { name: 'Mike R.', rating: 5, text: 'Sold my old furniture in just 2 days. The community here is trustworthy and responsive.' },
              { name: 'Emily K.', rating: 4, text: 'Great platform for both buying and selling. The review system helps make informed decisions.' },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent-500 text-accent-500" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4">"{testimonial.text}"</p>
                <p className="font-semibold text-slate-900 dark:text-white">— {testimonial.name}</p>
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
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-700 text-white font-semibold rounded-xl transition-all hover:bg-brand-800 border-2 border-brand-500"
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
