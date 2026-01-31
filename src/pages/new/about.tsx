import React from 'react';
import { Calendar, MapPin, Award, Users, Target, Eye } from 'lucide-react';
import Navbar from '@/components/new/NavBar';

const About = () => {
  const timeline = [
    { year: '2014', event: 'Company Incorporation', description: 'AICO GAS LIMITED was incorporated on February 24, 2014' },
    { year: '2015', event: 'First Operations', description: 'Began LPG refilling and distribution services in Benin City' },
    { year: '2018', event: 'Market Leadership', description: 'Became the leading cooking gas company in South-South Nigeria' },
    { year: '2024', event: 'Decade of Excellence', description: 'Celebrating 10+ years of reliable service and customer satisfaction' },
  ];

  const leadership = [
    {
      name: 'Engr. Alfred Edosomwan',
      position: 'Chief Executive Officer',
      description: 'Visionary leader with engineering expertise driving exponential growth',
      image: 'https://scontent.flos5-3.fna.fbcdn.net/v/t39.30808-6/505602673_122116368290875885_2310819862564472510_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=NlAnfWywoZkQ7kNvwGTcLTD&_nc_oc=AdkV7R6axyjmbzl8o-e1el0MMWShyLazi3pfTMvhGdjMheFcX3hCsmiU2_IJRlZ05Wdjrd8WBwwXTbzq9TLn0aVJ&_nc_zt=23&_nc_ht=scontent.flos5-3.fna&_nc_gid=TW6Gt3g1nq3kE-R-7VRLcQ&oh=00_AfMZaTuP7HOm40b1SdsGAdqa6MVxF1yRYhjKQ8xiZEQ7Bw&oe=68531D23'
    },
    {
      name: 'Mr. Elliot Edosomwan',
      position: 'General Manager',
      description: 'Operational excellence expert bringing innovation and management acumen',
      image: 'https://scontent.flos5-3.fna.fbcdn.net/v/t39.30808-6/506744461_122116370300875885_8981893220640645328_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=2TEAB1ZEMhAQ7kNvwGcfK6M&_nc_oc=Adm3IWpEd5gySmMct3AI0FOnGKOKOYBO3vrvcBH1cRPmR6w_gYD0YIJjS87ui3HA2jbRyuF2cG3Vh52NrlJGJz-3&_nc_zt=23&_nc_ht=scontent.flos5-3.fna&_nc_gid=D_B6f-ffhSUO0mhCpqKdwA&oh=00_AfN8xzZy3okx4PLnDcEYmSG3YShY6cfRymhUlq5LnDgO2Q&oe=68531E2C'
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
            About <span className="tw-bg-gradient-to-r tw-from-blue-400 tw-to-green-400 tw-bg-clip-text tw-text-transparent">AICO GAS</span>
          </h1>
          <p className="tw-text-xl tw-text-gray-300 tw-max-w-3xl tw-mx-auto tw-leading-relaxed">
            Over a decade of excellence in LPG services, serving as Nigeria's most trusted cooking gas company
          </p>
        </div>

        {/* Company Overview */}
        <section className="tw-mb-20">
          <div className="tw-bg-gray-800/40 tw-backdrop-blur-md tw-rounded-2xl tw-p-8 tw-border tw-border-gray-700/50">
            <div className="tw-grid md:tw-grid-cols-2 tw-gap-8 tw-items-center">
              <div>
                <h2 className="tw-text-2xl tw-font-bold tw-text-white tw-mb-4">Our Story</h2>
                <p className="tw-text-gray-300 tw-leading-relaxed tw-mb-4">
                  AICO GAS LIMITED is a proudly Nigerian Liquefied Petroleum Gas (LPG) company, 
                  incorporated on February 24, 2014, and operating as a key subsidiary of 
                  Almarence International Company Limited.
                </p>
                <p className="tw-text-gray-300 tw-leading-relaxed tw-mb-4">
                  With over a decade of dedicated service, AICO GAS has established itself as the 
                  leading cooking gas refilling and distribution company in South-South Nigeria.
                </p>
                <div className="tw-flex tw-items-center tw-space-x-4 tw-text-sm tw-text-gray-400">
                  <div className="tw-flex tw-items-center tw-space-x-1">
                    <Calendar className="tw-h-4 tw-w-4" />
                    <span>Est. 2014</span>
                  </div>
                  <div className="tw-flex tw-items-center tw-space-x-1">
                    <MapPin className="tw-h-4 tw-w-4" />
                    <span>Benin City, Edo State</span>
                  </div>
                </div>
              </div>
              <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                <div className="tw-bg-blue-600/20 tw-rounded-xl tw-p-4 tw-text-center">
                  <Award className="tw-h-8 tw-w-8 tw-text-blue-400 tw-mx-auto tw-mb-2" />
                  <div className="tw-text-white tw-font-semibold">Excellence</div>
                </div>
                <div className="tw-bg-green-600/20 tw-rounded-xl tw-p-4 tw-text-center">
                  <Users className="tw-h-8 tw-w-8 tw-text-green-400 tw-mx-auto tw-mb-2" />
                  <div className="tw-text-white tw-font-semibold">Customer First</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="tw-mb-20">
          <div className="tw-grid md:tw-grid-cols-2 tw-gap-8">
            <div className="tw-bg-gradient-to-br tw-from-blue-600/20 tw-to-blue-800/20 tw-backdrop-blur-md tw-rounded-2xl tw-p-8 tw-border tw-border-blue-500/30">
              <div className="tw-flex tw-items-center tw-mb-4">
                <Target className="tw-h-8 tw-w-8 tw-text-blue-400 tw-mr-3" />
                <h3 className="tw-text-2xl tw-font-bold tw-text-white">Our Mission</h3>
              </div>
              <p className="tw-text-gray-300 tw-leading-relaxed">
                To provide safe, accessible, and affordable LPG solutions that enhance daily 
                living while contributing to cleaner energy adoption in Nigeria.
              </p>
            </div>
            <div className="tw-bg-gradient-to-br tw-from-green-600/20 tw-to-green-800/20 tw-backdrop-blur-md tw-rounded-2xl tw-p-8 tw-border tw-border-green-500/30">
              <div className="tw-flex tw-items-center tw-mb-4">
                <Eye className="tw-h-8 tw-w-8 tw-text-green-400 tw-mr-3" />
                <h3 className="tw-text-2xl tw-font-bold tw-text-white">Our Vision</h3>
              </div>
              <p className="tw-text-gray-300 tw-leading-relaxed">
                To be the most trusted and innovative LPG brand across Nigeria and West Africa 
                through sustainable practices, smart technologies, and exceptional customer service.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="tw-mb-20">
          <h2 className="tw-text-3xl tw-font-bold tw-text-white tw-text-center tw-mb-12">Our Journey</h2>
          <div className="tw-space-y-8">
            {timeline.map((item, index) => (
              <div key={item.year} className="tw-flex tw-items-center group">
                <div className="tw-flex-shrink-0 tw-w-24 tw-text-right tw-mr-8">
                  <div className="tw-text-2xl tw-font-bold tw-text-blue-400">{item.year}</div>
                </div>
                <div className="tw-flex-shrink-0 tw-w-4 tw-h-4 tw-bg-blue-500 tw-rounded-full tw-mr-8 group-hover:tw-scale-150 tw-transition-transform"></div>
                <div className="tw-flex-1 tw-bg-gray-800/40 tw-backdrop-blur-md tw-rounded-lg tw-p-6 tw-border tw-border-gray-700/50 group-hover:tw-border-blue-500/50 tw-transition-all">
                  <h3 className="tw-text-lg tw-font-semibold tw-text-white tw-mb-2">{item.event}</h3>
                  <p className="tw-text-gray-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Leadership */}
        <section>
          <h2 className="tw-text-3xl tw-font-bold tw-text-white tw-text-center tw-mb-12">Leadership Team</h2>
          <div className="tw-grid md:tw-grid-cols-2 tw-gap-8">
            {leadership.map((leader, index) => (
              <div key={leader.name} className="tw-bg-gray-800/40 tw-backdrop-blur-md tw-rounded-2xl tw-p-8 tw-border tw-border-gray-700/50 hover:tw-border-blue-500/50 tw-transition-all tw-duration-300 group">
                <div className="tw-flex tw-items-center tw-mb-4">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="tw-w-16 tw-h-16 tw-rounded-full object-cover tw-mr-4 group-hover:tw-scale-110 tw-transition-transform"
                  />
                  <div>
                    <h3 className="tw-text-xl tw-font-semibold tw-text-white">{leader.name}</h3>
                    <p className="tw-text-blue-400 tw-font-medium">{leader.position}</p>
                  </div>
                </div>
                <p className="tw-text-gray-300 tw-leading-relaxed">{leader.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      </div>
    </div>
  );
};

export default About;