import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ShoppingCart, Briefcase, Star, Users, MapPin, Heart,
  Target, HelpCircle, Shield, ChevronDown, Zap, CheckCircle,
} from 'lucide-react';
import api from '../api/axios';

const CATEGORY_FALLBACK = {
  Electronics: '📱',
  Furniture: '🪑',
  Clothing: '👗',
  Books: '📚',
  Tools: '🔧',
  Sports: '⚽',
  Other: '📦',
};

// ─── Animation Variants ────────────────────────────────────────────────────────
const fadeUpVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay: i * 0.08 },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// Shared viewport config — low amount so only 10% needs to be visible
const VP = { once: true, amount: 0.1 };

// ─── Section Heading Component ─────────────────────────────────────────────────
const SectionHeading = ({ children, accent, sub, center = true }) => (
  <div className={`mb-12 ${center ? 'text-center' : ''}`}>
    <h2 className="text-3xl font-bold text-slate-900 dark:text-dark-text-primary mb-3">
      {children}{' '}
      {accent && (
        <span className="text-brand-600 dark:text-dark-brand">{accent}</span>
      )}
    </h2>
    <div className={`h-1 w-12 bg-brand-600 dark:bg-dark-brand rounded-full ${center ? 'mx-auto' : ''}`} />
    {sub && (
      <p className="mt-4 text-slate-500 dark:text-dark-text-secondary text-lg max-w-2xl mx-auto">
        {sub}
      </p>
    )}
  </div>
);

// ─── FAQ Accordion Item ────────────────────────────────────────────────────────
const FaqItem = ({ q, a, isOpen, onToggle }) => (
  <div className="bg-white dark:bg-dark-surface dark:border dark:border-dark-border rounded-xl shadow-sm overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-6 text-left gap-4 focus:outline-none group"
      aria-expanded={isOpen}
    >
      <span className="font-semibold text-slate-900 dark:text-dark-text-primary text-base group-hover:text-brand-600 dark:group-hover:text-dark-brand transition-colors">
        {q}
      </span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="flex-shrink-0 text-slate-400 dark:text-dark-text-secondary"
      >
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="answer"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <p className="px-6 pb-6 text-slate-600 dark:text-dark-text-secondary text-sm leading-relaxed">
            {a}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products?status=active&limit=4&sort=-createdAt');
        setFeaturedProducts(data.data?.slice(0, 4) || []);
      } catch {
        setFeaturedProducts([]);
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeatured();
  }, []);

  const faqs = [
    {
      q: 'How do I know a provider is trustworthy?',
      a: 'Every service provider on our platform goes through a verification process including identity confirmation and skills assessment. Additionally, all providers have public reviews and ratings from previous clients, so you can see their track record before booking. We also hold payments in escrow until the service is completed to your satisfaction.',
    },
    {
      q: "What happens if I'm not satisfied with a service?",
      a: "If a service doesn't meet the agreed-upon deliverables or quality standards, you can request a revision directly through our messaging system. Most providers offer 1–2 free revisions. If the issue cannot be resolved, you can open a dispute within 7 days of delivery, and our support team will mediate to find a fair solution, including potential refunds.",
    },
    {
      q: 'Can I sell products and offer services at the same time?',
      a: 'Absolutely! Many of our community members do both. You can list products in the marketplace section and offer services in the services section using the same account. Your profile will show both your product listings and service offerings, making it easy for buyers to see everything you provide.',
    },
    {
      q: 'Is there a fee to join the platform?',
      a: "Creating an account and browsing listings is completely free. For sellers, we charge a small 5% commission on successful product sales. For service providers, there's a 10% service fee on completed bookings. There are no monthly subscriptions or hidden fees — you only pay when you make a sale.",
    },
    {
      q: 'How are payments handled?',
      a: 'All payments are processed securely through our platform. When you book a service, the payment is held in escrow until the provider delivers the work. For products, payment is released to the seller once you confirm receipt and are satisfied with the item. This protects both buyers and sellers throughout the transaction.',
    },
    {
      q: 'Can I communicate with providers before booking?',
      a: "Yes! We encourage you to message providers before booking to discuss your requirements, timeline, and any questions you might have. Use our built-in messaging system to share files, clarify details, and ensure you and the provider are on the same page before making any commitments.",
    },
  ];

  return (
    <div className="min-h-screen">

      {/* ───────────────────── HERO ───────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Text */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-dark-text-primary mb-6 leading-tight">
                Your Local{' '}
                <span className="text-brand-600 dark:text-dark-brand">Marketplace</span>
                {' & '}
                <span className="text-accent-500 dark:text-dark-accent">Services</span>{' '}
                Hub
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-dark-text-secondary mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover amazing products from your neighbors and connect with skilled professionals. Buy, sell, and get things done — all in one trusted community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center px-8 py-4 bg-brand-600 hover:bg-brand-700 dark:bg-dark-brand dark:hover:bg-dark-brand-hover text-white dark:text-dark-bg font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-brand-500/25"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Explore Marketplace
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </motion.div>
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/services"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-dark-surface border-2 border-brand-600 dark:border-dark-brand text-brand-600 dark:text-dark-brand font-semibold rounded-xl transition-all hover:bg-brand-50 dark:hover:bg-dark-brand/10"
                  >
                    <Briefcase className="w-5 h-5 mr-2" />
                    Browse Services
                  </Link>
                </motion.div>
              </div>

              {/* Trust Stats */}
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-dark-border">
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { val: '500+', label: 'Active Providers', color: 'text-brand-600 dark:text-dark-brand' },
                    { val: '1,200+', label: 'Listings', color: 'text-accent-500 dark:text-dark-accent' },
                    { val: '4.8★', label: 'Avg Rating', color: 'text-accent-500 dark:text-dark-accent' },
                  ].map((s) => (
                    <div key={s.label} className="text-center lg:text-left">
                      <div className={`text-3xl font-bold ${s.color}`}>{s.val}</div>
                      <div className="text-sm text-slate-500 dark:text-dark-text-secondary">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right — Floating cards */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            >
              <div className="relative">
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────────────── FEATURED LISTINGS ───────────────────── */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={fadeUpVariant}
            className="flex justify-between items-end mb-10"
          >
            <SectionHeading center={false} accent="Listings">
              Featured
            </SectionHeading>
            <Link
              to="/products"
              className="text-brand-600 dark:text-dark-brand hover:text-brand-700 dark:hover:text-dark-brand-hover font-medium flex items-center gap-1 shrink-0 mb-3"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Skeleton shown outside animation wrapper so the observer fires on real content */}
          {loadingFeatured ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-dark-surface dark:border dark:border-dark-border rounded-2xl shadow-sm overflow-hidden animate-pulse">
                  <div className="aspect-square bg-slate-200 dark:bg-dark-surface-elevated" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-dark-surface-elevated rounded w-3/4" />
                    <div className="h-3 bg-slate-100 dark:bg-dark-bg rounded w-1/2" />
                    <div className="h-4 bg-slate-200 dark:bg-dark-surface-elevated rounded w-1/3 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="col-span-4 text-center py-16 text-slate-500 dark:text-dark-text-secondary">
                <ShoppingCart className="w-14 h-14 mx-auto mb-4 opacity-30" />
                <p className="text-lg mb-2">No listings yet.</p>
                <Link to="/products/new" className="text-brand-600 dark:text-dark-brand underline font-medium">
                  Be the first to sell!
                </Link>
              </div>
            </div>
          ) : (
            /* Only mount the animated wrapper once real data is ready —
               this ensures the IntersectionObserver attaches to stable, sized content */
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
            >
              {featuredProducts.map((item, i) => (
                <motion.div
                  key={item._id}
                  variants={fadeUpVariant}
                  custom={i}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <Link to={`/products/${item._id}`} className="block">
                    <div className="bg-white dark:bg-dark-surface dark:border dark:border-dark-border rounded-2xl shadow-sm group-hover:shadow-xl transition-all duration-300 overflow-hidden">
                      {/* Image area with overlays */}
                      <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-dark-surface dark:to-dark-surface-elevated overflow-hidden relative">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <span className="text-6xl absolute inset-0 flex items-center justify-center">
                            {CATEGORY_FALLBACK[item.category] || '📦'}
                          </span>
                        )}
                        {/* Category overlay — top-left */}
                        <div className="absolute top-3 left-3">
                          <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
                            {item.category || item.condition}
                          </span>
                        </div>
                        {/* Price overlay — top-right */}
                        <div className="absolute top-3 right-3">
                          <span className="bg-brand-600/90 dark:bg-dark-brand/90 backdrop-blur-sm text-white dark:text-dark-bg text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                            ${item.price}
                          </span>
                        </div>
                        {/* Heart icon — bottom-right, visible on hover */}
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute bottom-3 right-3 p-2 bg-white/80 dark:bg-dark-surface/80 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          onClick={(e) => { e.preventDefault(); /* wire up later */ }}
                          aria-label="Save to favorites"
                        >
                          <Heart className="w-4 h-4 text-rose-500" />
                        </motion.button>
                      </div>

                      {/* Card body */}
                      <div className="p-4">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-dark-text-primary mb-1 truncate group-hover:text-brand-600 dark:group-hover:text-dark-brand transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-dark-text-secondary mb-3">
                          <span className="capitalize">{item.condition}</span>
                          <span>•</span>
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{item.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          {item.ratingAvg > 0 ? (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-accent-500 text-accent-500 dark:fill-dark-accent dark:text-dark-accent" />
                              <span className="text-sm font-medium dark:text-dark-text-primary">{item.ratingAvg.toFixed(1)}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-dark-text-secondary">New listing</span>
                          )}
                          {item.sellerId?.name && (
                            <p className="text-xs text-slate-400 dark:text-dark-text-secondary truncate max-w-[100px]">
                              by {item.sellerId.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ───────────────────── HOW IT WORKS ───────────────────── */}
      <section className="py-16 md:py-24 bg-white dark:bg-dark-surface border-y border-transparent dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={fadeUpVariant}
          >
            <SectionHeading accent="Works">
              How It{' '}
            </SectionHeading>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            {[
              { step: '01', title: 'Browse & Discover', desc: 'Explore hundreds of local products and services from trusted community members. Filter by category, location, price, and ratings to find exactly what you need.', icon: ShoppingCart },
              { step: '02', title: 'Book or Buy', desc: 'Purchase products or book services with flexible scheduling. Your money is held safely in escrow until the work is completed to your satisfaction.', icon: CheckCircle },
              { step: '03', title: 'Chat & Get It Done', desc: 'Use our built-in messaging to coordinate with sellers and providers. Track status, get real-time updates, and leave a review when complete.', icon: Zap },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUpVariant} custom={i} className="text-center group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-16 h-16 bg-brand-100 dark:bg-dark-bg/60 dark:border dark:border-dark-border rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm group-hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl font-bold text-brand-600 dark:text-dark-brand">{item.step}</span>
                </motion.div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-dark-text-primary mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-dark-text-secondary leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────────────── TESTIMONIALS ───────────────────── */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeUpVariant}>
            <SectionHeading accent="Says">
              What Our Community{' '}
            </SectionHeading>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            {[
              { name: 'Sarah Ahmed', role: 'Small Business Owner, Lahore', rating: 5, text: "I needed a professional website for my bakery but couldn't afford agency prices. Found an amazing web developer here who understood my vision perfectly. My online orders have tripled since launch!" },
              { name: 'Michael Roberts', role: 'Freelance Designer, Karachi', rating: 5, text: 'Sold my old furniture in just 2 days when I was moving apartments. The community here is trustworthy and responsive — much better than dealing with strangers on other platforms.' },
              { name: 'Emily Khan', role: 'Student, Islamabad', rating: 4, text: 'Found an excellent math tutor through this platform when I was struggling with calculus. The rates were reasonable and being able to read reviews gave me confidence in my choice.' },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                variants={fadeUpVariant}
                custom={i}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-dark-surface dark:border dark:border-dark-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent-500 text-accent-500 dark:fill-dark-accent dark:text-dark-accent" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-dark-text-secondary mb-5 text-sm leading-relaxed">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold text-slate-900 dark:text-dark-text-primary text-sm">— {testimonial.name}</p>
                <p className="text-xs text-slate-500 dark:text-dark-text-secondary mt-0.5">{testimonial.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────────────── ABOUT SECTION ───────────────────── */}
      <section className="py-16 md:py-24 bg-white dark:bg-dark-surface border-y border-transparent dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeUpVariant}>
            <SectionHeading accent="Marketplace">
              About Smart Community{' '}
            </SectionHeading>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            {[
              {
                icon: Target,
                color: 'bg-brand-100 dark:bg-brand-900/30',
                iconColor: 'text-brand-600 dark:text-dark-brand',
                title: 'Our Mission',
                desc: "We built this platform to make finding trusted local services and quality second-hand products effortless. No more scrolling through Facebook groups — your community is your marketplace.",
              },
              {
                icon: Users,
                color: 'bg-accent-100 dark:bg-accent-900/20',
                iconColor: 'text-accent-600 dark:text-dark-accent',
                title: 'Who It\'s For',
                desc: "Small business owners, students, freelancers, and anyone who wants to buy or sell locally. Whether you need a web developer or want to sell your old furniture — we connect you fast.",
              },
              {
                icon: Shield,
                color: 'bg-emerald-100 dark:bg-emerald-900/20',
                iconColor: 'text-emerald-600 dark:text-emerald-400',
                title: 'How We Help',
                desc: 'Every provider is vetted, every transaction is secure, and every review builds community trust. Escrow payments ensure you only pay for work you\'re satisfied with.',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={fadeUpVariant}
                custom={i}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="flex flex-col items-start gap-4 p-6 bg-slate-50 dark:bg-dark-bg rounded-2xl border border-slate-100 dark:border-dark-border hover:border-brand-200 dark:hover:border-dark-brand/30 hover:shadow-md transition-all"
              >
                <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                  <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-dark-text-primary mb-2">{card.title}</h3>
                  <p className="text-slate-600 dark:text-dark-text-secondary leading-relaxed text-sm">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────────────── FAQ ACCORDION ───────────────────── */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeUpVariant}>
            <SectionHeading accent="Questions">
              Frequently Asked{' '}
            </SectionHeading>
          </motion.div>

          <motion.div
            className="space-y-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUpVariant} custom={i}>
                <FaqItem
                  q={faq.q}
                  a={faq.a}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────────────── CTA BANNER ───────────────────── */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-brand-600 via-brand-700 to-teal-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Join the Community Today</h2>
          <p className="text-brand-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with your neighbors, discover great deals, and get things done with trusted local professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-600 font-semibold rounded-xl transition-all hover:bg-brand-50 shadow-lg hover:shadow-xl"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-brand-700 hover:bg-brand-800 border-2 border-brand-500 text-white font-semibold rounded-xl transition-all"
              >
                Explore Now
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
