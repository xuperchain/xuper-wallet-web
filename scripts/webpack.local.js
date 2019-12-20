/**
 * @file (webpack.local)
 */

const webpack = require('webpack');
const merge = require('webpack-merge');

// dev conf
const devConf = require('./webpack.dev');
const conf = require('../conf');


module.exports = merge(
    devConf, {
        devServer: {
            proxy: {
                '/n/api': {
                    target: conf.proxyTarget,
                    changeOrigin: true
                }
            }
        },
        plugins: [
            new webpack.DefinePlugin({
                ENV: JSON.stringify('local'),
                ENDORSE: JSON.stringify(conf.endorse),
                NODE: JSON.stringify(conf.node)
            })
        ]
    }
);
