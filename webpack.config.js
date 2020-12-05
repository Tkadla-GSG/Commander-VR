module.exports = {
    mode: 'development',
    entry: "./scripts/index.ts",
    devtool: 'inline-source-map',
    output: {
        filename: "commander-vr.js"
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    devServer: {
        publicPath: '/dist',
    }
}