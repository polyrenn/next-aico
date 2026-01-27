import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Award, Users, TrendingUp, Phone, MessageCircle, Star, ChevronRight, UserPlus, ShoppingCart } from 'lucide-react';
import CustomerRegistration from '@/components/CustomerRegistration';
import GasPurchaseForm from '@/components/GasPurchaseForm';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isPurchaseFormOpen, setIsPurchaseFormOpen] = useState(false);

  const stats = [
    { label: 'Years of Excellence', value: '10+', icon: Award, color: 'from-blue-500 to-cyan-500' },
    { label: 'Happy Customers', value: '50K+', icon: Users, color: 'from-green-500 to-emerald-500' },
    { label: 'Service Reliability', value: '99.9%', icon: Shield, color: 'from-purple-500 to-pink-500' },
    { label: 'Market Growth', value: '200%', icon: TrendingUp, color: 'from-orange-500 to-red-500' },
  ];

  const features = [
    {
      title: 'Reliable Product Availability',
      description: 'Uninterrupted availability of gas products, even during periods of scarcity.',
      color: 'from-blue-500 to-cyan-500',
      icon: Shield
    },
    {
      title: 'Excellence in Service',
      description: 'Prompt, customer-friendly service tailored to homes, businesses, and industries.',
      color: 'from-green-500 to-emerald-500',
      icon: Award
    },
    {
      title: 'Expert Technical Team',
      description: 'Highly trained professionals offering expert diagnosis and safety solutions.',
      color: 'from-purple-500 to-pink-500',
      icon: Users
    },
    {
      title: 'Customer-Centric Approach',
      description: 'Priority on safety and comfort with comprehensive after-sales support.',
      color: 'from-orange-500 to-red-500',
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
    <div className="dark bg-gray-950 text-white min-h-screen selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600/20 to-green-600/20 backdrop-blur-md rounded-full text-blue-300 text-sm font-medium border border-blue-500/30">
                🔥 Nigeria&apos;s Leading LPG Company
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Fueling Homes,
              </span>
              <br />
              <span className="text-white">Empowering Communities</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Nigeria&apos;s leading LPG company with over a decade of excellence. We provide safe,
              accessible, and affordable cooking gas solutions across South-South Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setIsPurchaseFormOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center space-x-2 group"
              >
                <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Buy Gas</span>
              </button>
              <button
                onClick={() => setIsRegistrationOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center space-x-2 group"
              >
                <UserPlus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Register as Customer</span>
              </button>
              <Link
                href="/services"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center space-x-2 group"
              >
                <span>Explore Services</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:+2348085379134"
                className="px-8 py-4 bg-gray-800/50 backdrop-blur-md text-white rounded-xl font-semibold hover:bg-gray-700/50 transition-all duration-300 flex items-center space-x-2 border border-gray-600 group"
              >
                <Phone className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-green-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </section>

      {/* Quick Action Banners */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Buy Gas CTA */}
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center space-x-2">
                  <ShoppingCart className="h-6 w-6 text-orange-400" />
                  <span>Order Gas Online</span>
                </h3>
                <p className="text-gray-300 text-sm">
                  Quick and easy gas ordering with instant confirmation
                </p>
              </div>
              <button
                onClick={() => setIsPurchaseFormOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center space-x-2 group whitespace-nowrap"
              >
                <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Customer Registration CTA */}
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center space-x-2">
                  <UserPlus className="h-6 w-6 text-green-400" />
                  <span>Join Our Family</span>
                </h3>
                <p className="text-gray-300 text-sm">
                  Get your unique customer ID for faster service and exclusive benefits
                </p>
              </div>
              <button
                onClick={() => setIsRegistrationOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center space-x-2 group whitespace-nowrap"
              >
                <UserPlus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Register</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group hover:scale-105"
              >
                <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Sets Us Apart
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover why AICO GAS is the most trusted LPG provider in South-South Nigeria
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden bg-gray-800/40 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600 transition-all duration-500 hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <div className="relative flex items-start space-x-4">
                  <div className={`flex-shrink-0 p-3 bg-gradient-to-r ${feature.color} rounded-lg group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-300 text-lg">
              Real experiences from satisfied customers across Nigeria
            </p>
          </div>

          <div className="relative">
            <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl text-gray-300 mb-6 leading-relaxed">
                &quot;{testimonials[currentSlide].text}&quot;
              </blockquote>
              <div>
                <div className="text-white font-semibold">{testimonials[currentSlide].name}</div>
                <div className="text-gray-400 text-sm">{testimonials[currentSlide].location}</div>
              </div>
            </div>

            {/* Testimonial Dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 backdrop-blur-md rounded-2xl p-12 border border-gray-700/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10"></div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Experience Excellence?
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Join thousands of satisfied customers who trust AICO GAS for their LPG needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <span>Get Started Today</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://wa.me/2347013218705"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
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
  );
};

export default Home;