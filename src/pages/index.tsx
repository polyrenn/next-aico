import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Award, Users, TrendingUp, Phone, MessageCircle, Star, ChevronRight, UserPlus, ShoppingCart } from 'lucide-react';
import CustomerRegistration from '../components/new/CustomerRegistration';
import GasPurchaseForm from '../components/new/GasPurchaseForm';
import Navbar from '../components/new/NavBar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isPurchaseFormOpen, setIsPurchaseFormOpen] = useState(false);

  const stats = [
    { label: 'Years of Excellence', value: '10+', icon: Award, color: 'tw-from-blue-500 tw-to-cyan-500' },
    { label: 'Happy Customers', value: '50K+', icon: Users, color: 'tw-from-green-500 tw-to-emerald-500' },
    { label: 'Service Reliability', value: '99.9%', icon: Shield, color: 'tw-from-purple-500 tw-to-pink-500' },
    { label: 'Market Growth', value: '200%', icon: TrendingUp, color: 'tw-from-orange-500 tw-to-red-500' },
  ];

  const features = [
    {
      title: 'Reliable Product Availability',
      description: 'Uninterrupted availability of gas products, even during periods of scarcity.',
      color: 'tw-from-blue-500 tw-to-cyan-500',
      icon: Shield
    },
    {
      title: 'Excellence in Service',
      description: 'Prompt, customer-friendly service tailored to homes, businesses, and industries.',
      color: 'tw-from-green-500 tw-to-emerald-500',
      icon: Award
    },
    {
      title: 'Expert Technical Team',
      description: 'Highly trained professionals offering expert diagnosis and safety solutions.',
      color: 'tw-from-purple-500 tw-to-pink-500',
      icon: Users
    },
    {
      title: 'Customer-Centric Approach',
      description: 'Priority on safety and comfort with comprehensive after-sales support.',
      color: 'tw-from-orange-500 tw-to-red-500',
      icon: Star
    }
  ];

  const testimonials = [
    {
      name: 'Mrs. Sarah Okafor',
      location: 'Benin City',
      text: 'AICO GAS has been our trusted partner for over 5 years. Always reliable and professional.',
      rating: 5
    },
    {
      name: 'Chief Emmanuel Ugbodaga',
      location: 'Edo State',
      text: 'Excellent service delivery and competitive pricing. Highly recommended for all LPG needs.',
      rating: 5
    },
    {
      name: 'Mr. David Omoregie',
      location: 'Benin City',
      text: 'Their 24/7 availability and quality products make them the best choice in the region.',
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="dark tw-bg-gray-950 tw-text-white tw-min-h-screen selection:tw-bg-blue-500/30">
        <Navbar />
        {/* Hero Section */}
        <section className="tw-relative tw-overflow-hidden tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-py-20">
          <div className="tw-max-w-7xl tw-mx-auto">
            <div className="tw-text-center">
              <div className="tw-mb-6">
                <span className="tw-inline-block tw-px-4 tw-py-2 tw-bg-gradient-to-r tw-from-blue-600/20 tw-to-green-600/20 tw-backdrop-blur-md tw-rounded-full tw-text-blue-300 tw-text-sm tw-font-medium tw-border tw-border-blue-500/30">
                  🔥 Nigeria&apos;s Leading LPG Company
                </span>
              </div>
              <h1 className="tw-text-4xl md:tw-text-6xl tw-font-bold tw-text-white tw-mb-6 tw-leading-tight">
                <span className="tw-bg-gradient-to-r tw-from-blue-400 tw-to-green-400 tw-bg-clip-text tw-text-transparent">
                  Fueling Homes,
                </span>
                <br />
                <span className="tw-text-white">Empowering Communities</span>
              </h1>
              <p className="tw-text-xl tw-text-gray-300 tw-mb-8 tw-max-w-3xl tw-mx-auto tw-leading-relaxed">
                Nigeria&apos;s leading LPG company with over a decade of excellence. We provide safe,
                accessible, and affordable cooking gas solutions across South-South Nigeria.
              </p>
              <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4 tw-justify-center tw-items-center">
                <button
                  onClick={() => setIsPurchaseFormOpen(true)}
                  className="tw-px-8 tw-py-4 tw-bg-gradient-to-r tw-from-orange-600 tw-to-red-600 tw-text-white tw-rounded-xl tw-font-semibold hover:tw-shadow-lg hover:tw-shadow-orange-500/30 tw-transition-all tw-duration-300 tw-flex tw-items-center tw-space-x-2 tw-group"
                >
                  <ShoppingCart className="tw-h-5 tw-w-5 group-hover:tw-scale-110 tw-transition-transform" />
                  <span>Buy Gas</span>
                </button>
                <button
                  onClick={() => setIsRegistrationOpen(true)}
                  className="tw-px-8 tw-py-4 tw-bg-gradient-to-r tw-from-green-600 tw-to-blue-600 tw-text-white tw-rounded-xl tw-font-semibold hover:tw-shadow-lg hover:tw-shadow-green-500/30 tw-transition-all tw-duration-300 tw-flex tw-items-center tw-space-x-2 tw-group"
                >
                  <UserPlus className="tw-h-5 tw-w-5 group-hover:tw-scale-110 tw-transition-transform" />
                  <span>Register as Customer</span>
                </button>
                <Link
                  href="/services"
                  className="tw-px-8 tw-py-4 tw-bg-gradient-to-r tw-from-blue-600 tw-to-green-600 tw-text-white tw-rounded-xl tw-font-semibold hover:tw-shadow-lg hover:tw-shadow-blue-500/30 tw-transition-all tw-duration-300 tw-flex tw-items-center tw-space-x-2 tw-group"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="tw-h-5 tw-w-5 group-hover:tw-translate-x-1 tw-transition-transform" />
                </Link>
                <a
                  href="tel:+2348085379134"
                  className="tw-px-8 tw-py-4 tw-bg-gray-800/50 tw-backdrop-blur-md tw-text-white tw-rounded-xl tw-font-semibold hover:tw-bg-gray-700/50 tw-transition-all tw-duration-300 tw-flex tw-items-center tw-space-x-2 tw-border tw-border-gray-600 tw-group"
                >
                  <Phone className="tw-h-5 tw-w-5 group-hover:tw-scale-110 tw-transition-transform" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Animated Background Elements */}
          <div className="tw-absolute tw-top-20 tw-left-10 tw-w-20 tw-h-20 tw-bg-blue-500/20 tw-rounded-full tw-blur-xl tw-animate-pulse"></div>
          <div className="tw-absolute tw-bottom-20 tw-right-10 tw-w-32 tw-h-32 tw-bg-green-500/20 tw-rounded-full tw-blur-xl tw-animate-pulse tw-delay-1000"></div>
          <div className="tw-absolute tw-top-1/2 tw-left-1/4 tw-w-16 tw-h-16 tw-bg-red-500/20 tw-rounded-full tw-blur-xl tw-animate-pulse tw-delay-500"></div>
        </section>

        {/* Quick Action Banners */}
        <section className="tw-py-8 tw-px-4 sm:tw-px-6 lg:tw-px-8">
          <div className="tw-max-w-6xl tw-mx-auto tw-grid md:tw-grid-cols-2 tw-gap-6">
            {/* Buy Gas CTA */}
            <div className="tw-bg-gradient-to-r tw-from-orange-600/20 tw-to-red-600/20 tw-backdrop-blur-md tw-rounded-2xl tw-p-6 tw-border tw-border-gray-700/50 tw-relative tw-overflow-hidden tw-group hover:tw-scale-105 tw-transition-transform tw-duration-300">
              <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-r tw-from-orange-600/10 tw-to-red-600/10"></div>
              <div className="tw-relative tw-flex tw-items-center tw-justify-between">
                <div>
                  <h3 className="tw-text-xl tw-font-bold tw-text-white tw-mb-2 tw-flex tw-items-center tw-space-x-2">
                    <ShoppingCart className="tw-h-6 tw-w-6 tw-text-orange-400" />
                    <span>Order Gas Online</span>
                  </h3>
                  <p className="tw-text-gray-300 tw-text-sm">
                    Quick and easy gas ordering with instant confirmation
                  </p>
                </div>
                <button
                  onClick={() => setIsPurchaseFormOpen(true)}
                  className="tw-px-6 tw-py-3 tw-bg-gradient-to-r tw-from-orange-600 tw-to-red-600 tw-text-white tw-rounded-xl tw-font-semibold hover:tw-shadow-lg hover:tw-shadow-orange-500/30 tw-transition-all tw-duration-300 tw-flex tw-items-center tw-space-x-2 tw-group tw-whitespace-nowrap"
                >
                  <ShoppingCart className="tw-h-5 tw-w-5 group-hover:tw-scale-110 tw-transition-transform" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* Customer Registration CTA */}
            <div className="tw-bg-gradient-to-r tw-from-green-600/20 tw-to-blue-600/20 tw-backdrop-blur-md tw-rounded-2xl tw-p-6 tw-border tw-border-gray-700/50 tw-relative tw-overflow-hidden tw-group hover:tw-scale-105 tw-transition-transform tw-duration-300">
              <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-r tw-from-green-600/10 tw-to-blue-600/10"></div>
              <div className="tw-relative tw-flex tw-items-center tw-justify-between">
                <div>
                  <h3 className="tw-text-xl tw-font-bold tw-text-white tw-mb-2 tw-flex tw-items-center tw-space-x-2">
                    <UserPlus className="tw-h-6 tw-w-6 tw-text-green-400" />
                    <span>Join Our Family</span>
                  </h3>
                  <p className="tw-text-gray-300 tw-text-sm">
                    Get your unique customer ID for faster service and exclusive benefits
                  </p>
                </div>
                <button
                  onClick={() => setIsRegistrationOpen(true)}
                  className="tw-px-6 tw-py-3 tw-bg-gradient-to-r tw-from-green-600 tw-to-blue-600 tw-text-white tw-rounded-xl tw-font-semibold hover:tw-shadow-lg hover:tw-shadow-green-500/30 tw-transition-all tw-duration-300 tw-flex tw-items-center tw-space-x-2 tw-group tw-whitespace-nowrap"
                >
                  <UserPlus className="tw-h-5 tw-w-5 group-hover:tw-scale-110 tw-transition-transform" />
                  <span>Register</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="tw-py-16 tw-px-4 sm:tw-px-6 lg:tw-px-8">
          <div className="tw-max-w-7xl tw-mx-auto">
            <div className="tw-grid tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="tw-bg-gray-800/40 tw-backdrop-blur-md tw-rounded-xl tw-p-6 tw-border tw-border-gray-700/50 hover:tw-border-blue-500/50 tw-transition-all tw-duration-300 tw-group hover:tw-scale-105"
                >
                  <div className={`tw-flex tw-items-center tw-justify-center tw-w-12 tw-h-12 tw-bg-gradient-to-r ${stat.color} tw-rounded-lg tw-mb-4 group-hover:tw-scale-110 tw-transition-transform`}>
                    <stat.icon className="tw-h-6 tw-w-6 tw-text-white" />
                  </div>
                  <div className="tw-text-2xl tw-font-bold tw-text-white tw-mb-1">{stat.value}</div>
                  <div className="tw-text-gray-400 tw-text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="tw-py-20 tw-px-4 sm:tw-px-6 lg:tw-px-8">
          <div className="tw-max-w-7xl tw-mx-auto">
            <div className="tw-text-center tw-mb-16">
              <h2 className="tw-text-3xl md:tw-text-4xl tw-font-bold tw-text-white tw-mb-4">
                What Sets Us Apart
              </h2>
              <p className="tw-text-gray-300 tw-text-lg tw-max-w-2xl tw-mx-auto">
                Discover why AICO GAS is the most trusted LPG provider in South-South Nigeria
              </p>
            </div>
            
            <div className="tw-grid md:tw-grid-cols-2 tw-gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="tw-group tw-relative tw-overflow-hidden tw-bg-gray-800/40 tw-backdrop-blur-md tw-rounded-2xl tw-p-8 tw-border tw-border-gray-700/50 hover:tw-border-gray-600 tw-transition-all tw-duration-500 hover:tw-scale-105"
                >
                  <div className={`tw-absolute tw-inset-0 tw-bg-gradient-to-r ${feature.color} tw-opacity-0 group-hover:tw-opacity-10 tw-transition-opacity tw-duration-500`}></div>
                  <div className="tw-relative tw-flex tw-items-start tw-space-x-4">
                    <div className={`tw-flex-shrink-0 tw-p-3 tw-bg-gradient-to-r ${feature.color} tw-rounded-lg group-hover:tw-scale-110 tw-transition-transform`}>
                      <feature.icon className="tw-h-6 tw-w-6 tw-text-white" />
                    </div>
                    <div>
                      <h3 className="tw-text-xl tw-font-semibold tw-text-white tw-mb-3">{feature.title}</h3>
                      <p className="tw-text-gray-300 tw-leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="tw-py-20 tw-px-4 sm:tw-px-6 lg:tw-px-8">
          <div className="tw-max-w-4xl tw-mx-auto">
            <div className="tw-text-center tw-mb-16">
              <h2 className="tw-text-3xl md:tw-text-4xl tw-font-bold tw-text-white tw-mb-4">
                What Our Customers Say
              </h2>
              <p className="tw-text-gray-300 tw-text-lg">
                Real experiences from satisfied customers across Nigeria
              </p>
            </div>

            <div className="tw-relative">
              <div className="tw-bg-gray-800/40 tw-backdrop-blur-md tw-rounded-2xl tw-p-8 tw-border tw-border-gray-700/50 tw-text-center">
                <div className="tw-flex tw-justify-center tw-mb-4">
                  {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                    <Star key={i} className="tw-h-5 tw-w-5 tw-text-yellow-400 tw-fill-current" />
                  ))}
                </div>
                <blockquote className="tw-text-xl tw-text-gray-300 tw-mb-6 tw-leading-relaxed">
                  &quot;{testimonials[currentSlide].text}&quot;
                </blockquote>
                <div>
                  <div className="tw-text-white tw-font-semibold">{testimonials[currentSlide].name}</div>
                  <div className="tw-text-gray-400 tw-text-sm">{testimonials[currentSlide].location}</div>
                </div>
              </div>

              {/* Testimonial Dots */}
              <div className="tw-flex tw-justify-center tw-mt-6 tw-space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`tw-w-3 tw-h-3 tw-rounded-full tw-transition-all tw-duration-300 ${
                      index === currentSlide ? 'tw-bg-blue-500' : 'tw-bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="tw-py-20 tw-px-4 sm:tw-px-6 lg:tw-px-8">
          <div className="tw-max-w-4xl tw-mx-auto tw-text-center">
            <div className="tw-bg-gradient-to-r tw-from-blue-600/20 tw-to-green-600/20 tw-backdrop-blur-md tw-rounded-2xl tw-p-12 tw-border tw-border-gray-700/50 tw-relative tw-overflow-hidden">
              <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-r tw-from-blue-600/10 tw-to-green-600/10"></div>
              <div className="tw-relative">
                <h2 className="tw-text-3xl md:tw-text-4xl tw-font-bold tw-text-white tw-mb-4">
                  Ready to Experience Excellence?
                </h2>
                <p className="tw-text-gray-300 tw-text-lg tw-mb-8">
                  Join thousands of satisfied customers who trust AICO GAS for their LPG needs
                </p>
                <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4 tw-justify-center">
                  <Link
                    href="/contact"
                    className="tw-px-8 tw-py-4 tw-bg-gradient-to-r tw-from-blue-600 tw-to-green-600 tw-text-white tw-rounded-xl tw-font-semibold hover:tw-shadow-lg hover:tw-shadow-blue-500/30 tw-transition-all tw-duration-300 tw-flex tw-items-center tw-justify-center tw-space-x-2 tw-group"
                  >
                    <span>Get Started Today</span>
                    <ChevronRight className="tw-h-5 tw-w-5 group-hover:tw-translate-x-1 tw-transition-transform" />
                  </Link>
                  <a
                    href="https://wa.me/2347013218705"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tw-px-8 tw-py-4 tw-bg-green-600 tw-text-white tw-rounded-xl tw-font-semibold hover:tw-bg-green-700 tw-transition-all tw-duration-300 tw-flex tw-items-center tw-justify-center tw-space-x-2 tw-group"
                  >
                    <MessageCircle className="tw-h-5 tw-w-5 group-hover:tw-scale-110 tw-transition-transform" />
                    <span>WhatsApp Price Updates</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Registration Modal */}
        <CustomerRegistration 
          isOpen={isRegistrationOpen} 
          onClose={() => setIsRegistrationOpen(false)} 
        />

        {/* Gas Purchase Form Modal */}
        <GasPurchaseForm 
          isOpen={isPurchaseFormOpen} 
          onClose={() => setIsPurchaseFormOpen(false)} 
        />
      </div>
    </QueryClientProvider>
  );
};

export default Home;