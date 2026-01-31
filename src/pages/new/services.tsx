import React from 'react';
import { Flame, Home, Building2, Factory, Wrench, Shield, Clock, Headphones } from 'lucide-react';
import Navbar from '@/components/new/NavBar';

const Services = () => {
  const services = [
    {
      icon: Flame,
      title: 'LPG Refilling Services',
      description: 'Professional gas cylinder refilling with safety checks and quality assurance',
      features: ['Quality gas products', 'Safety inspections', 'Quick turnaround', 'Competitive pricing']
    },
    {
      icon: Home,
      title: 'Residential Solutions',
      description: 'Complete LPG solutions for homes including delivery and installation',
      features: ['Home delivery', 'Installation service', 'Safety training', '24/7 support']
    },
    {
      icon: Building2,
      title: 'Commercial Services',
      description: 'Tailored LPG solutions for restaurants, hotels, and commercial establishments',
      features: ['Bulk supply', 'Contract pricing', 'Regular maintenance', 'Priority support']
    },
    {
      icon: Factory,
      title: 'Industrial Supply',
      description: 'Large-scale LPG supply for industrial applications and manufacturing',
      features: ['Industrial grades', 'Volume discounts', 'Technical support', 'Custom solutions']
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Comprehensive safety protocols and certified equipment for all operations'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Round-the-clock service availability for emergency and regular needs'
    },
    {
      icon: Wrench,
      title: 'Expert Maintenance',
      description: 'Professional maintenance and repair services for all gas equipment'
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      description: 'Dedicated customer service team for queries and technical assistance'
    }
  ];

  return (
    <div className="dark tw-bg-gray-950 tw-text-white tw-min-h-screen selection:tw-bg-blue-500/30">
      <Navbar />
      <div className="tw-py-20 tw-px-4 sm:tw-px-6 lg:tw-px-8">
      <div className="tw-max-w-7xl tw-mx-auto">
        {/* Header */}
        <div className="tw-text-center tw-mb-16">
          <h1 className="tw-text-4xl md:tw-text-5xl tw-font-bold tw-text-white tw-mb-6">
            Our <span className="tw-bg-gradient-to-r tw-from-blue-400 tw-to-green-400 tw-bg-clip-text tw-text-transparent">Services</span>
          </h1>
          <p className="tw-text-xl tw-text-gray-300 tw-max-w-3xl tw-mx-auto tw-leading-relaxed">
            Comprehensive LPG solutions designed to meet the diverse needs of homes, businesses, and industries
          </p>
        </div>

        {/* Main Services */}
        <section className="tw-mb-20">
          <div className="tw-grid md:tw-grid-cols-2 tw-gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="tw-bg-gray-800/40 tw-backdrop-blur-md tw-rounded-2xl tw-p-8 tw-border tw-border-gray-700/50 hover:tw-border-blue-500/50 tw-transition-all tw-duration-300 group"
              >
                <div className="tw-flex tw-items-start tw-mb-6">
                  <div className="tw-p-3 tw-bg-gradient-to-r tw-from-blue-500 tw-to-green-500 tw-rounded-lg tw-mr-4 group-hover:tw-scale-110 tw-transition-transform">
                    <service.icon className="tw-h-8 tw-w-8 tw-text-white" />
                  </div>
                  <div className="tw-flex-1">
                    <h3 className="tw-text-xl tw-font-semibold tw-text-white tw-mb-2">{service.title}</h3>
                    <p className="tw-text-gray-300 tw-leading-relaxed">{service.description}</p>
                  </div>
                </div>
                <div className="tw-space-y-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="tw-flex tw-items-center tw-text-gray-400">
                      <div className="tw-w-2 tw-h-2 tw-bg-blue-400 tw-rounded-full tw-mr-3"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Service Features */}
        <section className="tw-mb-20">
          <h2 className="tw-text-3xl tw-font-bold tw-text-white tw-text-center tw-mb-12">Why Choose Our Services</h2>
          <div className="tw-grid md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="tw-bg-gray-800/40 tw-backdrop-blur-md tw-rounded-xl tw-p-6 tw-border tw-border-gray-700/50 hover:tw-border-green-500/50 tw-transition-all tw-duration-300 tw-text-center group"
              >
                <div className="tw-inline-flex tw-items-center tw-justify-center tw-w-12 tw-h-12 tw-bg-gradient-to-r tw-from-green-500 tw-to-blue-500 tw-rounded-lg tw-mb-4 group-hover:tw-scale-110 tw-transition-transform">
                  <feature.icon className="tw-h-6 tw-w-6 tw-text-white" />
                </div>
                <h3 className="tw-text-lg tw-font-semibold tw-text-white tw-mb-2">{feature.title}</h3>
                <p className="tw-text-gray-300 tw-text-sm tw-leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="tw-mb-20">
          <h2 className="tw-text-3xl tw-font-bold tw-text-white tw-text-center tw-mb-12">Our Service Process</h2>
          <div className="tw-grid md:tw-grid-cols-4 tw-gap-6">
            {[
              { step: '01', title: 'Contact Us', description: 'Reach out via phone, WhatsApp, or visit our location' },
              { step: '02', title: 'Assessment', description: 'Our experts assess your specific LPG requirements' },
              { step: '03', title: 'Service Delivery', description: 'Professional service delivery with safety protocols' },
              { step: '04', title: 'Follow-up Support', description: 'Ongoing support and maintenance services' }
            ].map((process, index) => (
              <div key={process.step} className="tw-relative">
                <div className="tw-bg-gray-800/40 tw-backdrop-blur-md tw-rounded-xl tw-p-6 tw-border tw-border-gray-700/50 tw-text-center hover:tw-border-blue-500/50 tw-transition-all tw-duration-300">
                  <div className="tw-text-3xl tw-font-bold tw-text-blue-400 tw-mb-3">{process.step}</div>
                  <h3 className="tw-text-lg tw-font-semibold tw-text-white tw-mb-2">{process.title}</h3>
                  <p className="tw-text-gray-300 tw-text-sm tw-leading-relaxed">{process.description}</p>
                </div>
                {index < 3 && (
                  <div className="tw-hidden md:tw-block tw-absolute top-1/2 -right-3 tw-w-6 tw-h-0.5 tw-bg-gradient-to-r tw-from-blue-500 tw-to-green-500"></div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="tw-bg-gradient-to-r tw-from-blue-600/20 tw-to-green-600/20 tw-backdrop-blur-md tw-rounded-2xl tw-p-12 tw-border tw-border-gray-700/50 tw-text-center">
            <h2 className="tw-text-3xl tw-font-bold tw-text-white tw-mb-4">Ready to Get Started?</h2>
            <p className="tw-text-gray-300 tw-text-lg tw-mb-8 tw-max-w-2xl tw-mx-auto">
              Contact us today to discuss your LPG requirements and discover how we can serve you better
            </p>
            <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4 tw-justify-center">
              <a
                href="tel:+2348085379134"
                className="tw-px-8 tw-py-4 tw-bg-gradient-to-r tw-from-blue-600 tw-to-green-600 tw-text-white tw-rounded-xl tw-font-semibold hover:tw-shadow-lg hover:tw-shadow-blue-500/30 tw-transition-all tw-duration-300"
              >
                Call Now: +234 808 537 9134
              </a>
              <a
                href="https://wa.me/2347013218705"
                target="_blank"
                rel="noopener noreferrer"
                className="tw-px-8 tw-py-4 tw-bg-green-600 tw-text-white tw-rounded-xl tw-font-semibold hover:tw-bg-green-700 tw-transition-all tw-duration-300"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
};

export default Services;