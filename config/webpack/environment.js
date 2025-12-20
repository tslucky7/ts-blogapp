const { environment } = require('@rails/webpacker');

// TypeScript support
environment.loaders.append('typescript', {
  test: /\.tsx?$/,
  use: [
    {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        appendTsSuffixTo: [/\.vue$/],
        appendTsxSuffixTo: [/\.vue$/],
      },
    },
  ],
});

// Add TypeScript extensions
environment.config.merge({
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
});

module.exports = environment;
