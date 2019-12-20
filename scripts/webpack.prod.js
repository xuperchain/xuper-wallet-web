/**
 * @file (webpack.prod)
 */

const webpack = require('webpack');
const merge = require('webpack-merge');

// common
const commonConf = require('./wepback.common');

// extensions
const extensions = require('./extension');

// plugins
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(
    commonConf, {
        mode: 'production',
        optimization: {
            namedChunks: true,
            nodeEnv: 'production',
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    cache: true,
                    terserOptions: {
                        output: {
                            comments: false
                        }
                    }
                }),
                new OptimizeCSSAssetsPlugin({
                    cssProcessorPluginOptions: {
                        preset: ['default', {discardComments: {removeAll: true}}]
                    }
                })
            ],
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/](react|react-dom|antd)[\\/]/,
                        name: 'vendor'
                    }
                }
            }
        },
        module: {
            rules: [
                {
                    test: /\.(png|jpg|gif)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 8192,
                                outputPath: extensions.commonPath.static.assetsPath,
                                publicPath: extensions.join(
                                    extensions.commonUrl.url,
                                    extensions.commonPath.static.assetsPath
                                )
                            }
                        }
                    ]
                }
            ]
        },
        output: {
            filename: extensions.join(extensions.commonPath.static.jsPath, '[name]_[chunkhash:7].js'),
            path: extensions.commonPath.buildPath,
            publicPath: extensions.commonUrl.url || '/'
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: extensions.join(extensions.commonPath.static.cssPath, '[name]_[hash:7].css'),
                chunkFilename: extensions.join(extensions.commonPath.static.cssPath, '[name]_[hash:7].css')
            }),
            new CleanWebpackPlugin({
                root: extensions.commonPath.rootPath
            }),
            new webpack.DefinePlugin({
                ENV: JSON.stringify('prod')
            }),
            new HtmlWebpackPlugin({
                inject: false,
                template: HtmlWebpackTemplate,
                filename: extensions.join(extensions.commonPath.htmlPath, 'index.html'),
                title: extensions.info.projectTitle,
                meta: [
                    {
                        name: 'viewport',
                        content: 'width=device-width, initial-scale=1, maximum-scale=1,'
                            + ' user-scalable=no, shrink-to-fit=no, viewport-fit=cover'
                    },
                    {
                        name: 'google',
                        content: 'notranslate'
                    }
                ],
                bodyHtmlSnippet: '<main></main>'
            })
        ]
    }
);
