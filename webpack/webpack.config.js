const Path = require("path");

module.exports = {
    mode: "development",

    entry: {
        home: "./resources/scripts/home.ts",
        about: "./resources/scripts/about.ts",
    },

    output: {
        path: Path.resolve(__dirname, "../dist"),
        filename: "[name].js",
    },

    module: {
        rules: [
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
