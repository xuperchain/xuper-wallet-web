/**
 * @file (webpack.release)
 */

const webpack = require('webpack');
const merge = require('webpack-merge');
const prodConf = require('./webpack.prod.js');
const conf = require('../conf');

module.exports = merge(
    prodConf, {
        plugins: [
            new webpack.DefinePlugin({
                ENDORSE: JSON.stringify(conf.endorse),
                NODE: JSON.stringify(conf.node)
            })
        ]
    }
);
