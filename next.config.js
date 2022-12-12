module.exports = {
  webpack: (config) => {
    config.node = {
      __filename: false
    }
    return config
  },
  rewrites: async () => {
    return [
      {
        source: '/',
        destination: '/public/main.html',
      },
    ]
},
async redirects() {
  return [
    {
      source: '/',
      destination: '/main.html',
      permanent: true,
    },
  ]
},
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};
