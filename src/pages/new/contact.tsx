import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, CheckCircle } from 'lucide-react';
import Navbar from '@/components/new/NavBar';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Our Location',
      details: '4 Oko Daily Market Road, Opposite Oko Prison Gate, Airport Road, Benin City, Edo State',
      action: 'Get Directions',
      link: 'https://maps.google.com/?q=4+Oko+Daily+Market+Road+Benin+City'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+234 808 537 9134',
      action: 'Call Now',
      link: 'tel:+2348085379134'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: 'aicogas2014@gmail.com',
      action: 'Send Email',
      link: 'mailto:aicogas2014@gmail.com'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      details: '+234 701 321 8705',
      action: 'Chat Now',
      link: 'https://wa.me/2347013218705'
    }
  ];

  const businessHours = [
    { day: 'Monday - Friday', hours: '7:00 AM - 6:30 PM' },
    { day: 'Saturday', hours: '7:00 AM - 6:30 PM' },
    { day: 'Sunday', hours: '9:00 AM - 4:30 PM' },
    { day: 'Emergency Service', hours: '24/7 Available' }
  ];

  const services = [
    'LPG Refilling Services',
    'Residential Delivery',
    'Commercial Supply',
    'Industrial Solutions',
    'Equipment Maintenance',
    'Safety Consultation',
    'Bulk Orders',
    'Emergency Supply'
  ];

  return (
    <div className="dark tw-bg-gray-950 tw-text-white tw-min-h-screen selection:tw-bg-blue-500/30">
      <Navbar />
      <div className="tw-py-20 tw-px-4 sm:tw-px-6 lg:tw-px-8">
      <div className="tw-max-w-7xl tw-mx-auto">
        {/* Header */}
        <div className="tw-text-center tw-mb-16">
          <h1 className="tw-text-4xl md:tw-text-5xl tw-font-bold tw-text-white tw-mb-6">
            Get In <span className="tw-bg-gradient-to-r tw-from-blue-400 tw-to-green-400 tw-bg-clip-text tw-text-transparent">Touch</span>
          </h1>
          <p className="tw-text-xl tw-text-gray-300 tw-max-w-3xl tw-mx-auto tw-leading-relaxed">
            Ready to experience excellence in LPG services? Contact us today for all your cooking gas needs.
          </p>
        </div>

        <div className="tw-grid lg:tw-grid-cols-3 tw-gap-8 tw-mb-20">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="tw-bg-gray-800/40 tw-backdrop-blur-md tw-rounded-2xl tw-p-8 tw-border tw-border-gray-700/50">
              <h2 className="tw-text-2xl tw-font-bold tw-text-white tw-mb-6">Send Us a Message</h2>
              
              {isSubmitted && (
                <div className="tw-bg-green-600/20 tw-border tw-border-green-500/50 tw-rounded-lg tw-p-4 tw-mb-6 tw-flex tw-items-center tw-space-x-3">
                  <CheckCircle className="tw-h-5 tw-w-5 tw-text-green-400" />
                  <span className="tw-text-green-300">Thank you! Your message has been sent successfully.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="tw-space-y-6">
                <div className="tw-grid md:tw-grid-cols-2 tw-gap-6">
                  <div>
                    <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-300 tw-mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="tw-w-full tw-px-4 tw-py-3 tw-bg-gray-700/50 tw-border tw-border-gray-600 tw-rounded-lg tw-text-white placeholder-gray-400 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent tw-transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-300 tw-mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="tw-w-full tw-px-4 tw-py-3 tw-bg-gray-700/50 tw-border tw-border-gray-600 tw-rounded-lg tw-text-white placeholder-gray-400 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent tw-transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="tw-grid md:tw-grid-cols-2 tw-gap-6">
                  <div>
                    <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-300 tw-mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="tw-w-full tw-px-4 tw-py-3 tw-bg-gray-700/50 tw-border tw-border-gray-600 tw-rounded-lg tw-text-white placeholder-gray-400 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent tw-transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-300 tw-mb-2">
                      Service Needed
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="tw-w-full tw-px-4 tw-py-3 tw-bg-gray-700/50 tw-border tw-border-gray-600 tw-rounded-lg tw-text-white focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent tw-transition-all"
                    >
                      <option value="">Select a service</option>
                      {services.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-300 tw-mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="tw-w-full tw-px-4 tw-py-3 tw-bg-gray-700/50 tw-border tw-border-gray-600 tw-rounded-lg tw-text-white placeholder-gray-400 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent tw-transition-all resize-none"
                    placeholder="Tell us about your requirements..."
                  />
                </div>

                <button
                  type="submit"
                  className="tw-w-full tw-px-8 tw-py-4 tw-bg-gradient-to-r tw-from-blue-600 tw-to-green-600 tw-text-white tw-rounded-lg tw-font-semibold hover:tw-shadow-lg hover:tw-shadow-blue-500/30 tw-transition-all tw-duration-300 tw-flex tw-items-center tw-justify-center tw-space-x-2 group"
                >
                  <Send className="tw-h-5 tw-w-5 group-hover:translate-x-1 tw-transition-transform" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="tw-space-y-6">
            {/* Quick Actions */}
            <div className="tw-bg-gray-800/40 tw-backdrop-blur-md tw-rounded-2xl tw-p-6 tw-border tw-border-gray-700/50">
              <h3 className="tw-text-xl tw-font-bold tw-text-white tw-mb-4">Quick Actions</h3>
              <div className="tw-space-y-3">
                <a
                  href="https://wa.me/2347013218705?text=Hi%20AICO%20GAS,%20I%20need%20assistance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tw-flex tw-items-center tw-space-x-3 tw-p-3 tw-bg-green-600/20 hover:tw-bg-green-600/30 tw-rounded-lg tw-transition-all tw-duration-300 group"
                >
                  <MessageCircle className="tw-h-5 tw-w-5 tw-text-green-400 group-hover:tw-scale-110 tw-transition-transform" />
                  <span className="tw-text-green-300 tw-font-medium">WhatsApp Support</span>
                </a>
                <a
                  href="tel:+2348085379134"
                  className="tw-flex tw-items-center tw-space-x-3 tw-p-3 tw-bg-blue-600/20 hover:tw-bg-blue-600/30 tw-rounded-lg tw-transition-all tw-duration-300 group"
                >
                  <Phone className="tw-h-5 tw-w-5 tw-text-blue-400 group-hover:tw-scale-110 tw-transition-transform" />
                  <span className="tw-text-blue-300 tw-font-medium">Emergency Call</span>
                </a>
                <a
                  href="https://wa.me/2347013218705"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tw-flex tw-items-center tw-space-x-3 tw-p-3 tw-bg-red-600/20 hover:tw-bg-red-600/30 tw-rounded-lg tw-transition-all tw-duration-300 group"
                >
                  <MessageCircle className="tw-h-5 tw-w-5 tw-text-red-400 group-hover:tw-scale-110 tw-transition-transform" />
                  <span className="tw-text-red-300 tw-font-medium">Price Updates</span>
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="tw-bg-gray-800/40 tw-backdrop-blur-md tw-rounded-2xl tw-p-6 tw-border tw-border-gray-700/50">
              <div className="tw-flex tw-items-center tw-mb-4">
                <Clock className="tw-h-6 tw-w-6 tw-text-blue-400 tw-mr-2" />
                <h3 className="tw-text-xl tw-font-bold tw-text-white">Business Hours</h3>
              </div>
              <div className="tw-space-y-3">
                {businessHours.map((schedule, index) => (
                  <div key={index} className="tw-flex tw-justify-between tw-items-center tw-py-2 tw-border-b tw-border-gray-700/50 last:tw-border-b-0">
                    <span className="tw-text-gray-300 tw-font-medium">{schedule.day}</span>
                    <span className="tw-text-white">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Cards */}
        <section className="tw-mb-20">
          <div className="tw-grid md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={info.title}
                className="tw-bg-gray-800/40 tw-backdrop-blur-md tw-rounded-xl tw-p-6 tw-border tw-border-gray-700/50 hover:tw-border-blue-500/50 tw-transition-all tw-duration-300 tw-text-center group"
              >
                <div className="tw-inline-flex tw-items-center tw-justify-center tw-w-12 tw-h-12 tw-bg-gradient-to-r tw-from-blue-500 tw-to-green-500 tw-rounded-lg tw-mb-4 group-hover:tw-scale-110 tw-transition-transform">
                  <info.icon className="tw-h-6 tw-w-6 tw-text-white" />
                </div>
                <h3 className="tw-text-lg tw-font-semibold tw-text-white tw-mb-2">{info.title}</h3>
                <p className="tw-text-gray-300 tw-text-sm tw-mb-4 tw-leading-relaxed">{info.details}</p>
                <a
                  href={info.link}
                  target={info.link.startsWith('http') ? '_blank' : undefined}
                  rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="tw-inline-block tw-px-4 tw-py-2 tw-bg-blue-600 tw-text-white tw-rounded-lg tw-text-sm tw-font-medium hover:tw-bg-blue-700 tw-transition-colors"
                >
                  {info.action}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Map Section */}
        <section className="tw-mb-20">
          <div className="tw-bg-gray-800/40 tw-backdrop-blur-md tw-rounded-2xl tw-p-8 tw-border tw-border-gray-700/50">
            <h2 className="tw-text-3xl tw-font-bold tw-text-white tw-text-center tw-mb-8">Find Us</h2>
            <div className="aspect-video tw-bg-gray-700/50 tw-rounded-xl tw-flex tw-items-center tw-justify-center">
              <div className="tw-text-center tw-text-gray-400">
                <MapPin className="tw-h-16 tw-w-16 tw-mx-auto tw-mb-4 tw-opacity-50" />
                <p className="tw-text-lg tw-mb-2">Interactive Map</p>
                <p className="tw-text-sm tw-mb-4">4 Oko Daily Market Road, Opposite Oko Prison Gate<br />Airport Road, Benin City, Edo State</p>
                <a
                  href="https://maps.google.com/?q=4+Oko+Daily+Market+Road+Benin+City"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tw-inline-block tw-px-6 tw-py-3 tw-bg-blue-600 tw-text-white tw-rounded-lg tw-font-medium hover:tw-bg-blue-700 tw-transition-colors"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="tw-bg-gradient-to-r tw-from-blue-600/20 tw-to-green-600/20 tw-backdrop-blur-md tw-rounded-2xl tw-p-12 tw-border tw-border-gray-700/50 tw-text-center">
            <h2 className="tw-text-3xl tw-font-bold tw-text-white tw-mb-4">Ready to Get Started?</h2>
            <p className="tw-text-gray-300 tw-text-lg tw-mb-8 tw-max-w-2xl tw-mx-auto">
              Experience the excellence of AICO GAS LIMITED. Contact us today for reliable LPG solutions.
            </p>
            <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4 tw-justify-center">
              <a
                href="tel:+2348085379134"
                className="tw-px-8 tw-py-4 tw-bg-gradient-to-r tw-from-blue-600 tw-to-green-600 tw-text-white tw-rounded-xl tw-font-semibold hover:tw-shadow-lg hover:tw-shadow-blue-500/30 tw-transition-all tw-duration-300"
              >
                Call Us Now
              </a>
              <a
                href="https://wa.me/2347013218705"
                target="_blank"
                rel="noopener noreferrer"
                className="tw-px-8 tw-py-4 tw-bg-green-600 tw-text-white tw-rounded-xl tw-font-semibold hover:tw-bg-green-700 tw-transition-all tw-duration-300"
              >
                WhatsApp Chat
              </a>
            </div>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
};

export default Contact;