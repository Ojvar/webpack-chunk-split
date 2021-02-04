const Path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpackMode = process.env.NODE_ENV || "production";
const devMode = webpackMode == "development";

module.exports = {
    mode: webpackMode,

    entry: {
        scripts__home_dot_js: "./resources/scripts/home.ts",
        scripts__about_dot_js: "./resources/scripts/about.ts",
        styles__vue_styles_dot_css: "./resources/styles/vue-styles.scss",
    },

    output: {
        path: Path.resolve(__dirname, "../dist"),
        filename: (chunk) => {
            const name = chunk.chunk.name;
            if (name.startsWith("styles__")) {
                return name + ".js";
            } else {
                return convertName(chunk.chunk.name);
            }
        },
    },

    plugins: [new VueLoaderPlugin(), miniCssExtractPlugin(), suppressPlugin()],

    module: {
        rules: [
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
                                    sourceMap: devMode,
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
                                    sourceMap: devMode,
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
function suppressPlugin() {
    const SuppressChunksPlugin = require("suppress-chunks-webpack-plugin")
        .default;
    const options = ["styles__vue_styles_dot_css"];

    return new SuppressChunksPlugin(options, { filter: /\.js$/ });
}

/**
 * Mini Css plugin
 */
function miniCssExtractPlugin() {
    // return new MiniCssExtractPlugin();
    return new MiniCssExtractPlugin({
        filename: (chunk) => convertName(chunk.chunk.name),
        // filename: devMode ? "[name].css" : "[name].[contenthash].css",
        chunkFilename: devMode ? "[id].css" : "[id].[contenthash].css",
    });
}

/**
 * Convert name
 * @param {*} name
 */
function convertName(name) {
    return name.replace(/__/i, "/").replace(/\_dot\_/i, ".");
}
