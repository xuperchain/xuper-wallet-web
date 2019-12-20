/**
 * @file (webpack.dev)
 */

const os = require('os');
const webpack = require('webpack');
const merge = require('webpack-merge');

// common conf
const commonConf = require('./wepback.common');

// extensions
const extensions = require('./extension');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// current IP
let IPv4;
for (let i = 0; i < os.networkInterfaces().en0.length; i++) {
    if (os.networkInterfaces().en0[i].family === 'IPv4') {
        IPv4 = os.networkInterfaces().en0[i].address;
    }
}

// port
const PORT = 8080;

module.exports = merge(
    commonConf, {
        mode: 'development',
        devServer: {
            contentBase: extensions.commonPath.buildPath,
            compress: true,
            host: '0.0.0.0',
            public: `${IPv4}:${PORT}`,
            port: PORT,
            hot: true,
            disableHostCheck: true
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
                                    extensions.commonUrl.devUrl,
                                    extensions.commonPath.static.assetsPath
                                )
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin({
                inject: false,
                template: HtmlWebpackTemplate,
                filename: 'index.html',
                title: extensions.info.projectTitle,
                meta: [
                    {
                        name: 'viewport',
                        content: 'width=device-width, initial-scale=1, maximum-scale=1,'
                            + ' user-scalable=no'
                    },
                    {
                        name: 'google',
                        content: 'notranslate'
                    }
                ],
                bodyHtmlSnippet: '<main></main>'
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css'
            })
        ]
    }
);
