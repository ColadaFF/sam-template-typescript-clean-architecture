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
      UseCase$: path.resolve(__dirname, './src/utils/useCase.ts'),
      Handler$: path.resolve(__dirname, './src/utils/handlerUtils/index.ts'),
      User$: path.resolve(__dirname, './src/utils/user.ts'),
      Error$: path.resolve(__dirname, './src/utils/error.ts'),
      Controller$: path.resolve(__dirname, './src/utils/controller/index.ts'),
      ID$: path.resolve(__dirname, './src/utils/idUtils.ts'),
      Preconditions$: path.resolve(__dirname, './src/utils/preconditions.ts'),
      'adaptative-tests': path.resolve(__dirname, './src/adaptative-tests'),
    },
  },
  target: 'node',

  // Set the webpack mode
  mode: process.env.NODE_ENV || 'production',

  // Add the TypeScript loader
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader', exclude: [/ajv-keywords/] },
    ],
  },

  // Add the AWS SAM Webpack plugin
  plugins: [awsSamPlugin],
};
