const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    "assert": require.resolve("assert/"), 
    "buffer": require.resolve("buffer/"),
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "util": require.resolve("util/"),
    "path": require.resolve("path-browserify"),
    "url": require.resolve("url/"),
    "http": require.resolve("stream-http"),
    "querystring": require.resolve("querystring-es3"),
    "zlib": require.resolve("browserify-zlib"),
    "process": require.resolve("process/browser"),
    "net": false,
    "fs": false
  };
  
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser.js'
    })
  );
  
  return config;
}