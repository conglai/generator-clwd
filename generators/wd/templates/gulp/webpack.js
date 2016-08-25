'use strict';
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const onlinePlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production')
  }
});
var config = {
  entry: './app.jsx',
  output: {
    path: '',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  resolve: {
    // add alias for application code directory
    alias:{
      '@common': __dirname + '/../common',
      '@icons': __dirname + '/../icons',
    },
    extensions: [ '', '.js', '.less', '.png' ]
  },
  module: {
    loaders: [
      { test: /\.less$/,
        loader: ExtractTextPlugin.extract(
          // activate source maps via loader query
          'css?sourceMap!' +
          'less?sourceMap'
        )
      },
      { test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          // activate source maps via loader query
          'css?sourceMap'
        )
      },
      { test: /\.ejs$/, loader: 'ejs-loader?variable=data' },
      { test: /\.png$/, loader: 'url-loader?mimetype=image/png' },
      { test: /\.gif$/, loader: 'url-loader?mimetype=image/gif' },
      { test: /\.woff$/, loader: 'url-loader?mimetype=application/font-woff' },
      { test: /\.ttf$/, loader: 'url-loader?mimetype=application/font-ttf' }
    ]
  },
  externals: {
    'react': 'window.React',
    'react-dom': 'window.ReactDOM'
  }
};
const _ = require('lodash');
module.exports = function(entry, path, jsName, cssName, isOnline, buildES3){
  let plugins = [new ExtractTextPlugin(cssName)];
  if(isOnline) {
    plugins.push(onlinePlugin);
  }
  let jsLoader;
  if(buildES3) {
    jsLoader = { test: /\.js$/,
      loader: 'babel', // 'babel-loader' is also a legal name to reference
      exclude: /node_modules/,
      query: {
        presets: ['es2015-loose', 'stage-0'],
        plugins: [
          'transform-runtime',
          'transform-es3-property-literals',
          'transform-es3-member-expression-literals',
          'transform-class-properties',
          'transform-es2015-object-super'
        ]
      }
    };
  } else {
    jsLoader = { test: /\.js$/,
      loader: 'babel', // 'babel-loader' is also a legal name to reference
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'stage-0'],
        plugins: [
          'transform-runtime',
          'transform-class-properties',
          'transform-es2015-object-super'
        ]
      }
    };
  }
  let resultConfig = _.clone(config, true);
  resultConfig.plugins = plugins;
  resultConfig.entry = entry;
  resultConfig.module.loaders.push(jsLoader);
  resultConfig.output.path = path;
  resultConfig.output.filename = jsName;
  return resultConfig;
};
