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
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};
