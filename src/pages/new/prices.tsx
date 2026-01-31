import React, { useState, useEffect } from 'react';
import { MessageCircle, TrendingUp, Clock, AlertCircle, Flame, RefreshCw } from 'lucide-react';
import Navbar from '@/components/new/NavBar';
import { prisma } from '../../lib/prisma';
import { GetServerSideProps } from 'next';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

const queryClient = new QueryClient();

interface PriceData {
  id: number;
  branchId: number;
  category: string;
  pricePerKg: number;
  availableKgs: number[];
}

interface PricesPageProps {
  initialData: PriceData | null;
}

const PriceUpdatesContent = ({ initialData }: PricesPageProps) => {
  const { data: dbPriceData, refetch, isFetching } = useQuery({
    queryKey: ['publicPrices'],
    queryFn: async () => {
      const res = await fetch('/api/Prices/GetPriceList?branch=111111');
      const data = await res.json();
      return data.find((p: any) => p.category.toLowerCase() === 'domestic');
    },
    initialData: initialData,
  });

  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefreshPrices = () => {
    refetch().then(() => {
      setLastUpdated(new Date());
    });
  };

  // Format the DB data into the display format
  const displayPrices = React.useMemo(() => {
    if (!dbPriceData) return {};
    
    const basePrices: Record<string, any> = {};
    const kgs = dbPriceData.availableKgs || [1, 6, 12.5, 25, 50];
    
    kgs.forEach((kg: number) => {
      const label = `${kg}kg`;
      basePrices[label] = {
        price: Math.round(dbPriceData.pricePerKg * kg),
        change: '+0.0%', // Default for real data
        trend: 'neutral'
      };
    });
    
    return basePrices;
  }, [dbPriceData]);

  const marketInsights = [
    {
      title: 'Market Stability',
      description: 'LPG prices remain stable with minimal fluctuations due to steady supply',
      status: 'positive'
    },
    {
      title: 'Seasonal Demand',
      description: 'Increased demand during festive periods may affect pricing',
      status: 'neutral'
    },
    {
      title: 'Quality Assurance',
      description: 'All prices include safety checks and quality guarantee',
      status: 'positive'
    }
  ];

  return (
    <div className="dark tw-bg-gray-950 tw-text-white tw-min-h-screen selection:tw-bg-blue-500/30">
      <Navbar />
      <div className="tw-py-20 tw-px-4 sm:tw-px-6 lg:tw-px-8">
      <div className="tw-max-w-6xl tw-mx-auto">
        {/* Header */}
        <div className="tw-text-center tw-mb-16">
          <h1 className="tw-text-4xl md:tw-text-5xl tw-font-bold tw-text-white tw-mb-6">
            Live <span className="tw-bg-gradient-to-r tw-from-blue-400 tw-to-green-400 tw-bg-clip-text tw-text-transparent">Price Updates</span>
          </h1>
          <p className="tw-text-xl tw-text-gray-300 tw-max-w-3xl tw-mx-auto tw-leading-relaxed tw-mb-8">
            Stay informed with real-time LPG pricing. Get instant updates via WhatsApp for the best deals.
          </p>
          
          <div className="tw-flex tw-items-center tw-justify-center tw-space-x-4 tw-text-gray-400 tw-mb-8">
            <div className="tw-flex tw-items-center tw-space-x-2">
              <Clock className="tw-h-5 tw-w-5" />
              <span>Last Updated: {mounted ? lastUpdated.toLocaleString() : '--'}</span>
            </div>
            <button
              onClick={handleRefreshPrices}
              disabled={isFetching}
              className="tw-flex tw-items-center tw-space-x-2 tw-px-4 tw-py-2 tw-bg-gray-700 hover:tw-bg-gray-600 tw-rounded-lg tw-transition-colors disabled:tw-opacity-50"
            >
              <RefreshCw className={`tw-h-4 tw-w-4 ${isFetching ? 'tw-animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          <a
            href="https://wa.me/2347013218705"
            target="_blank"
            rel="noopener noreferrer"
            className="tw-inline-flex tw-items-center tw-space-x-3 tw-px-8 tw-py-4 tw-bg-green-600 tw-text-white tw-rounded-xl tw-font-semibold hover:tw-bg-green-700 tw-transition-all tw-duration-300 hover:tw-shadow-lg hover:tw-shadow-green-500/30"
          >
            <MessageCircle className="tw-h-6 tw-w-6" />
            <span>Get WhatsApp Price Updates</span>
          </a>
        </div>

        {/* Price Cards */}
        <section className="tw-mb-20">
          <div className="tw-grid md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
            {Object.entries(displayPrices).map(([size, data]: [string, any]) => (
              <div
                key={size}
                className="tw-bg-gray-800/40 tw-backdrop-blur-md tw-rounded-2xl tw-p-6 tw-border tw-border-gray-700/50 hover:tw-border-blue-500/50 tw-transition-all tw-duration-300 group"
              >
                <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
                  <div className="tw-flex tw-items-center tw-space-x-3">
                    <div className="tw-p-2 tw-bg-gradient-to-r tw-from-blue-500 tw-to-green-500 tw-rounded-lg group-hover:tw-scale-110 tw-transition-transform">
                      <Flame className="tw-h-6 tw-w-6 tw-text-white" />
                    </div>
                    <h3 className="tw-text-xl tw-font-semibold tw-text-white">{size}</h3>
                  </div>
                  <div className={`tw-flex tw-items-center tw-space-x-1 tw-text-sm tw-font-medium ${
                    data.trend === 'up' ? 'tw-text-green-400' : data.trend === 'down' ? 'tw-text-red-400' : 'tw-text-gray-400'
                  }`}>
                    <TrendingUp className={`tw-h-4 tw-w-4 ${data.trend === 'down' ? 'tw-rotate-180' : ''}`} />
                    <span>{data.change}</span>
                  </div>
                </div>
                
                <div className="tw-text-center tw-py-4">
                  <div className="tw-text-3xl tw-font-bold tw-text-white tw-mb-1">
                    ₦{data.price.toLocaleString()}
                  </div>
                  <div className="tw-text-gray-400 tw-text-sm">Per cylinder</div>
                </div>
                
                <button className="tw-w-full tw-py-3 tw-bg-gradient-to-r tw-from-blue-600 tw-to-green-600 tw-text-white tw-rounded-lg tw-font-medium hover:tw-shadow-lg hover:tw-shadow-blue-500/30 tw-transition-all tw-duration-300">
                  Order Now
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Market Insights */}
        <section className="tw-mb-20">
          <h2 className="tw-text-3xl tw-font-bold tw-text-white tw-text-center tw-mb-12">Market Insights</h2>
          <div className="tw-grid md:tw-grid-cols-3 tw-gap-6">
            {marketInsights.map((insight, index) => (
              <div
                key={insight.title}
                className="tw-bg-gray-800/40 tw-backdrop-blur-md tw-rounded-xl tw-p-6 tw-border tw-border-gray-700/50 hover:tw-border-blue-500/50 tw-transition-all tw-duration-300"
              >
                <div className="tw-flex tw-items-start tw-space-x-3">
                  <div className={`tw-p-2 tw-rounded-lg ${
                    insight.status === 'positive' ? 'tw-bg-green-500/20 tw-text-green-400' : 
                    insight.status === 'negative' ? 'tw-bg-red-500/20 tw-text-red-400' : 
                    'tw-bg-yellow-500/20 tw-text-yellow-400'
                  }`}>
                    <AlertCircle className="tw-h-5 tw-w-5" />
                  </div>
                  <div>
                    <h3 className="tw-text-lg tw-font-semibold tw-text-white tw-mb-2">{insight.title}</h3>
                    <p className="tw-text-gray-300 tw-text-sm tw-leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Price History Chart Placeholder */}
        <section className="tw-mb-20">
          <h2 className="tw-text-3xl tw-font-bold tw-text-white tw-text-center tw-mb-12">Price Trends</h2>
          <div className="tw-bg-gray-800/40 tw-backdrop-blur-md tw-rounded-2xl tw-p-8 tw-border tw-border-gray-700/50">
            <div className="tw-flex tw-items-center tw-justify-center tw-h-64 tw-text-gray-400">
              <div className="tw-text-center">
                <TrendingUp className="tw-h-16 tw-w-16 tw-mx-auto tw-mb-4 tw-opacity-50" />
                <p className="tw-text-lg">Price trend analysis coming soon</p>
                <p className="tw-text-sm">Historical data and forecasting features</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="tw-bg-gradient-to-r tw-from-blue-600/20 tw-to-green-600/20 tw-backdrop-blur-md tw-rounded-2xl tw-p-12 tw-border tw-border-gray-700/50 tw-text-center">
            <h2 className="tw-text-3xl tw-font-bold tw-text-white tw-mb-4">Stay Updated on Prices</h2>
            <p className="tw-text-gray-300 tw-text-lg tw-mb-8 tw-max-w-2xl tw-mx-auto">
              Subscribe to our WhatsApp price alerts and never miss the best deals on LPG
            </p>
            <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4 tw-justify-center">
              <a
                href="https://wa.me/2347013218705?text=Hi%20AICO%20GAS,%20I%20want%20to%20subscribe%20to%20price%20updates"
                target="_blank"
                rel="noopener noreferrer"
                className="tw-px-8 tw-py-4 tw-bg-green-600 tw-text-white tw-rounded-xl tw-font-semibold hover:tw-bg-green-700 tw-transition-all tw-duration-300 tw-flex tw-items-center tw-justify-center tw-space-x-2"
              >
                <MessageCircle className="tw-h-5 tw-w-5" />
                <span>Subscribe to Updates</span>
              </a>
              <a
                href="tel:+2348085379134"
                className="tw-px-8 tw-py-4 tw-bg-gray-800/50 tw-backdrop-blur-md tw-text-white tw-rounded-xl tw-font-semibold hover:tw-bg-gray-700/50 tw-transition-all tw-duration-300 tw-border tw-border-gray-600"
              >
                Call for Bulk Pricing
              </a>
            </div>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
};

const PriceUpdates = (props: PricesPageProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PriceUpdatesContent {...props} />
    </QueryClientProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const priceData = await prisma.prices.findFirst({
      where: {
        branchId: 1, // Default to branch 1 for public prices
        category: {
          equals: 'domestic',
          mode: 'insensitive'
        }
      }
    });

    return {
      props: {
        initialData: priceData ? JSON.parse(JSON.stringify(priceData)) : null
      }
    };
  } catch (error) {
    console.error('Error fetching prices:', error);
    return {
      props: {
        initialData: null
      }
    };
  }
};

export default PriceUpdates;