module.exports = {
  webpack: (config) => {
    config.node = {
      __filename: false
    }
    return config
  }
};
