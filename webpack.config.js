const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // The entry point of your app
  output: {
    path: path.resolve(__dirname, 'dist'), // Output folder
    filename: 'bundle.js', // Output file name
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Match .js or .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/, // Match .css files
        use: ['style-loader', 'css-loader'], // Use style-loader and css-loader for CSS files
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Resolve .js and .jsx files
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Template for the HTML file
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'public'), // Use 'static' instead of 'contentBase'
    compress: true,
    port: 9000, // Port for the dev server
  },
  mode: 'development', // Use 'production' for production builds
};