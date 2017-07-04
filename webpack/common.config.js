
const webpack = require("webpack");
const projectConfig = require("../project.config");
const pkg = require("../package.json");
const util = require("../scripts/util");

module.exports = function (options) {

    /*************************
     * Common Entry
     **************************/

    let entry = projectConfig.bundleMainFile;


    /*************************
     * Common Plugins
     **************************/

    let plugins = [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin()
    ];

    /*************************
     * Common rules
     **************************/

    let typescriptLoader = {test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        query: {
            tsconfig: projectConfig.rootDir+"/tsconfig.json"
        }
    };

    if(options.env === projectConfig.Environments.TEST && !options.isLocalTesting) //adding inline source map only for test node environment
    {
        typescriptLoader.query.sourceMap = false;
        typescriptLoader.query.inlineSourceMap = true;
    }

    let rules = [typescriptLoader];

    return {
        entry:entry,
        output:{
            path:projectConfig.standAloneDir,
            filename: pkg.name + ".js",
            library:util.camelCase(pkg.name),
            libraryTarget:"umd"
        },
        resolve: {
            extensions: [ '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
            modules: [
                "src",
                "node_modules"
            ]
        },
        module: {
            rules: rules
        },
        plugins: plugins,
        node:  {
            global: true,
            crypto: 'empty',
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false
        }
    }
};