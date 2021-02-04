const Path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpackMode = process.env.NODE_ENV || "production";
const isDev = webpackMode == "development";

module.exports = {
    mode: webpackMode,

    entry: {
        home: "./resources/scripts/home.ts",
        about: "./resources/scripts/about.ts",
    },

    output: {
        path: Path.resolve(__dirname, "../dist"),
        filename: "[name].js",
    },

    plugins: [new VueLoaderPlugin()],

    module: {
        rules: [
            {
                test: /\.styl(us)?$/,
                oneOf: [
                    {
                        resourceQuery: /vue/,
                        use: [
                            "style-loader",
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: isDev,
                                },
                            },
                            "stylus-loader",
                        ],
                    },
                    {
                        resourceQuery: /(?!vue)/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: isDev,
                                },
                            },
                            "less-loader",
                        ],
                    },
                ],
            },
            {
                test: /\.less$/,
                oneOf: [
                    {
                        resourceQuery: /vue/,
                        use: [
                            "style-loader",
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: isDev,
                                },
                            },
                            "less-loader",
                        ],
                    },
                    {
                        resourceQuery: /(?!vue)/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: isDev,
                                },
                            },
                            "less-loader",
                        ],
                    },
                ],
            },
            {
                test: /\.(scss|sass|css)$/,
                oneOf: [
                    {
                        resourceQuery: /vue/,
                        use: [
                            "style-loader",
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: isDev,
                                },
                            },
                            "sass-loader",
                        ],
                    },
                    {
                        resourceQuery: /(?!vue)/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: isDev,
                                },
                            },
                            "sass-loader",
                        ],
                    },
                ],
            },
            {
                test: /\.pug$/,
                oneOf: [
                    {
                        resourceQuery: /^\?vue/,
                        use: ["pug-plain-loader"],
                    },
                    {
                        use: ["raw-loader", "pug-plain-loader"],
                    },
                ],
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
        ],
    },

    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            vue$: "vue/dist/vue.esm.js",
        },
    },

    optimization: {
        splitChunks: {
            chunks: "all",
            maxAsyncRequests: 30,
            minChunks: 1,

            cacheGroups: {
                vue: {
                    chunks: "all",
                    test: /[\\/]node_modules[\\/]vue.*/,
                    name: `chunks/vue`,
                },

                commons: {
                    chunks: "all",
                    test: /[\\/]node_modules[\\/]/,
                    name(module, chunks, cacheGroupKey) {
                        const chunkData = extractChunkData(
                            module,
                            chunks,
                            cacheGroupKey
                        );
                        const chunkFileName = chunkData.moduleFileName.replace(
                            /\.js/i,
                            ""
                        );

                        return `chunks/${chunkFileName}`;
                        // return `${chunkData.cacheGroupKey}-${chunkData.allChunksNames}-${chunkData.moduleFileName}`;
                    },
                },
            },
        },
    },
};

/**
 * ExtractChunkData
 * @param {*} module
 * @param {*} chunk
 * @param {*} cacheGroupKey
 */
function extractChunkData(module, chunks, cacheGroupKey) {
    const moduleFileName = module
        .identifier()
        .split("/")
        .reduceRight((item) => item);

    const allChunksNames = chunks.map((item) => item.name).join("~");

    return {
        moduleFileName,
        allChunksNames,
        cacheGroupKey,
    };
}
