const Path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpackMode = process.env.NODE_ENV || "production";
const isDev = webpackMode == "development";

module.exports = {
    mode: webpackMode,

    entry: {
        scripts__home_dot_js: "./resources/scripts/home.ts",
        scripts__about_dot_js: "./resources/scripts/about.ts",
        styles__vue_styles_dot_css: "./resources/styles/vue-styles.scss",
    },

    output: {
        path: Path.resolve(__dirname, "../dist"),
        filename: (chunk) =>
            chunk.chunk.name.replace(/__/i, "/").replace(/\_dot\_/i, "."),
    },

    plugins: [vueLoaderPlugin(), miniCssExtract()],

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
                    name: `chunks/vue.js`,
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
                        const chunkFileName = chunkData.moduleFileName;

                        return `chunks/${chunkFileName}.js`;
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

/**
 * Suppress plugin
 */
function suppressPlugin(sender) {
    console.log(sender);

    const SuppressChunksPlugin = require("suppress-chunks-webpack-plugin")
        .default;

    // const styles = entries.styles || {};
    const styles = {};
    const options = Object.keys(styles).map(
        (key) => (
            {
                name: key,
                match: /\.js\.map$/,
            },
            {
                name: key,
                match: /\.js$/,
            }
        )
    );

    return new SuppressChunksPlugin(options);
}

/**
 * VueLoader plugin
 */
function vueLoaderPlugin(env, entries) {
    const VueLoaderPlugin = require("vue-loader/lib/plugin");

    return new VueLoaderPlugin();
}

/**
 * MiniCssExtract plugin
 */
function miniCssExtract(env, entries) {
    return new MiniCssExtractPlugin();
}
