const path = require('path');
const AwsSamPlugin = require('aws-sam-webpack-plugin');

const awsSamPlugin = new AwsSamPlugin();

module.exports = {
  entry: () => awsSamPlugin.entry(),

  output: {
    filename: chunkData => awsSamPlugin.filename(chunkData),
    libraryTarget: 'commonjs2',
    path: path.resolve('.'),
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      UseCase: path.resolve(__dirname, './src/utils/UseCase.ts'),
      Handler: path.resolve(__dirname, './src/utils/MakeHandler.ts'),
    },
  },
  target: 'node',

  // Set the webpack mode
  mode: process.env.NODE_ENV || 'production',

  // Add the TypeScript loader
  module: {
    rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }],
  },

  // Add the AWS SAM Webpack plugin
  plugins: [awsSamPlugin],
};
