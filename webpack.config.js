/**
 * Base webpack config used across other specific configs
 */
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './app/index.jsx',
  output: {
    filename: '[hash].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/'
  },
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({ template: 'index.ejs' }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      component: path.resolve(__dirname, 'app/component'),
      style: path.resolve(__dirname, 'app/style'),
      asset: path.resolve(__dirname, 'app/style/asset'),
      reducer: path.resolve(__dirname, 'app/reducer'),
      store: path.resolve(__dirname, 'app/store'),
      lib: path.resolve(__dirname, 'lib'),
      root: path.resolve(__dirname),
    }
  },
  module: {
    rules: [
    	// babel
    	{
	      test: /\.(js|jsx)$/,
	      exclude: /(node_modules|bower_components)/,
	      use: {
	        loader: 'babel-loader',
	        options: {
	          presets: ['es2015', 'react']
	        }
	      }
	    },
      // style
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      // image
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      // font
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  devServer: {
    contentBase: './dist'
  }
};