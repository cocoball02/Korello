const path = require('path');
const RefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  name: 'Korello',
  mode: 'development',
  devtool: 'eval',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  entry: ['./src/index.js'],
  module: {
    rules: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: ['> 5% in KR'],
                },
              },
            ],
            '@babel/preset-react',
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties',
            'react-refresh/babel',
          ],
        },
      },
      {
        test: /\.(png|jpeg)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  plugins: [new RefreshWebpackPlugin()],
  output: {
    path: path.join(__dirname, ''),
    filename: 'index.js',
  },
  devServer: {
    publicPath: '/',
    hot: true,
    port: 3000,
    historyApiFallback: true,
  },
};
