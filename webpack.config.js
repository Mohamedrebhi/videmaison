module.exports = {
  // ... other webpack config
  resolve: {
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "stream": require.resolve("stream-browserify"),
      "url": require.resolve("url/"),
      "querystring": require.resolve("querystring-es3"),
      "util": require.resolve("util/"),
      "assert": require.resolve("assert/"),
      "constants": require.resolve("constants-browserify"),
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "vm": require.resolve("vm-browserify"),
      "fs": false,
      "child_process": false
    }
  }
};