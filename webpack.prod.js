const { merge } = require('webpack-merge');
const base = require('./webpack.config.my.js');

module.exports = merge(base, {
    mode: 'production',
})