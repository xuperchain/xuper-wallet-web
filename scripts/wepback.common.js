/**
 * @file (wepback.common)
 */

const webpack = require('webpack');

// extensions
const extensions = require('./extension');

// plugins
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const conf = {
    entry: [
        '@babel/polyfill',
        extensions.info.entry
    ],
    output: {
        filename: '[name].bundle.js',
        path: extensions.commonPath.buildPath
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('autoprefixer')
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    },
                    {
                        loader: 'less-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('autoprefixer')
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.jsx?$/,
                exclude: extensions.commonPath.modulesPathMatch,
                loader: 'babel-loader'
            },
            {
                test: /\.worker\.js$/,
                use: {
                    loader: 'worker-loader',
                    options: {
                        inline: true,
                        fallback: false
                    }
                }
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: '@svgr/webpack',
                        options: {
                            svgAttributes: {
                                fill: 'currentColor'
                            },
                            svgoConfig: {
                                multipass: true,
                                pretty: process.env.NODE_ENV === 'development',
                                indent: 2,
                                plugins: [
                                    {sortAttrs: true},
                                    {removeViewBox: false},
                                    {removeDimensions: true},
                                    {convertColors: {currentColor: true}}
                                ]
                            }
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            extensions.join(__dirname, '..', 'src'),
            extensions.join(__dirname, '..', 'node_modules')
        ],
        alias: {
            '@app': extensions.join(__dirname, '..', 'src/app'),
            '@public': extensions.join(__dirname, '..', 'src/public'),
            '@theme': extensions.join(__dirname, '..', 'src/app/theme'),
            '@routes': extensions.join(__dirname, '..', 'src/app/routes'),
            '@components': extensions.join(__dirname, '..', 'src/app/components'),
            '@views': extensions.join(__dirname, '..', 'src/app/views'),
            '@pages': extensions.join(__dirname, '..', 'src/app/pages'),
            '@context': extensions.join(__dirname, '..', 'src/app/context'),
            '@libs': extensions.join(__dirname, '..', 'src/app/libs'),
            '@reducers': extensions.join(__dirname, '..', 'src/app/reducers'),
            '@actions': extensions.join(__dirname, '..', 'src/app/actions'),
            '@store': extensions.join(__dirname, '..', 'src/app/store'),
            '@containers': extensions.join(__dirname, '..', 'src/app/containers'),
            '@constants': extensions.join(__dirname, '..', 'src/app/constants'),
            '@conf': extensions.join(__dirname, '..', 'src/app/conf')
        }
    },
    plugins: [
        new CopyPlugin([
            {
                from: 'src/app/libs/sdk/xuper.sdk.wasm',
                to: extensions.join(extensions.commonPath.static.path, '/wasm'),
                flatten: true
            }
        ]),
        new webpack.IgnorePlugin({
            resourceRegExp: /^fs$/
        })
    ],
    node: {
        fs: 'empty'
    }
};

module.exports = conf;
