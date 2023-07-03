const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const NODE_ENV = process.env.NODE_ENV;
const IS_DEV = NODE_ENV === 'development';
const IS_PROD = NODE_ENV === 'production';

const setupDevtool = () => {
    if (IS_DEV) return 'eval';
    if (IS_PROD) return false;
};

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [
                    IS_PROD ? MiniCssExtractPlugin.loader : 'style-loader',
                    {
                        loader: 'css-loader',
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico|woff2|woff|mp3)$/i,
                type: 'asset/resource'
            },
        ],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            favicon: './src/favicon.ico'
        }),
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash].css',
        })
    ],
    output: {
        publicPath: IS_DEV ? '/' : './',
        filename: 'index[contenthash].js',
        clean: true,
    },
    devtool: setupDevtool(),
    devServer: {
        static: path.join(__dirname, 'dist'),
        historyApiFallback: true,
        port: 3000,
        open: true,
        hot: true,
    },
};