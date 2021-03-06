const path = require('path');
const dotenv = require('dotenv');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');

module.exports = () => {
  const env = dotenv.config().parsed;

  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    mode: 'development',
    entry: './src/main/index.tsx',
    output: {
      path: path.join(__dirname, 'public/js'),
      publicPath: '/public/js',
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', 'scss'],
      alias: {
        '@': path.join(__dirname, 'src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpeg|jpg|gif|svg)$/,
          exclude: /node_modules/,
          loader: 'url-loader',
          options: {
            limit: 1000,
            name: '../images/[name].[ext]',
            publicPath: '../../', // If I don't use it, webpack will try to take the image in the js folder
          },
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
      ],
    },
    devServer: {
      contentBase: './public',
      writeToDisk: true,
      historyApiFallback: true,
      port: 3000,
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    plugins: [new CleanWebpackPlugin(), new DefinePlugin(envKeys)],
  };
};
