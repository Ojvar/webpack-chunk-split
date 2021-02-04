const Path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpackMode = process.env.NODE_ENV || "production";
const devMode = webpackMode == "development";
const entries = getEntries();

module.exports = {
    mode: webpackMode,

    entry: entries,

    output: {
        path: Path.resolve(__dirname, "../dist"),
        filename: (chunk) => {
            const name = chunk.chunk.name + ".js";
            return name.startsWith("styles__") ? name : convertName(name);
        },
        chunkFilename: (chunk) => {
            const name = chunk.chunk.name + ".js";
            return name.startsWith("styles__") ? name : convertName(name);
        },
    },

    plugins: [new vueLoaderPlugin(), miniCssExtractPlugin(), suppressPlugin()],

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
                    test: /[\\/]node_modules[\\/]vue/,
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
                        const chunkFileName = chunkData.moduleFileName;

                        return `chunks/${chunkFileName}`;
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
    const options = Object.keys(entries).filter((x) =>
        x.startsWith("styles__")
    );

    return new SuppressChunksPlugin(options, { filter: /\.js$/ });
}

/**
 * Mini Css plugin
 */
function miniCssExtractPlugin() {
    return new MiniCssExtractPlugin({
        filename: (chunk) => convertName(chunk.chunk.name) + ".css",
        chunkFilename: (chunk) => convertName(chunk.chunk.name) + ".css",
        // filename: devMode ? "[name].css" : "[name].[contenthash].css",
        // chunkFilename: devMode ? "[id].css" : "[id].[contenthash].css",
    });
}

/**
 * Convert name
 * @param {*} name
 */
function convertName(name) {
    return name.replace(/__/i, "/");
}

/**
 * VueLoader plugin
 */
function vueLoaderPlugin() {
    const VueLoaderPlugin = require("vue-loader/lib/plugin");

    return new VueLoaderPlugin();
}

/**
 * Get Entries
 */
function getEntries() {
    return {
        scripts__home: "./resources/scripts/home.ts",
        scripts__about: "./resources/scripts/about.ts",
        styles__vue_styles: "./resources/styles/vue-styles.scss",
    };
}
