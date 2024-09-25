const webpack = require('webpack');

/**
 * Edit webpack config...
 */
module.exports = function override(config, env) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify"),
        "url": require.resolve("url"),
        "vm": require.resolve("vm-browserify")
    })
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        }), 
    ])

    // Add Babel plugin to remove console logs in production
    if (env === 'production') {
        const babelLoader = config.module.rules.find(rule => rule.oneOf)
            .oneOf.find(rule => rule.loader && rule.loader.includes('babel-loader'));

        if (babelLoader) {
            babelLoader.options.plugins = (babelLoader.options.plugins || []).concat(
                "babel-plugin-transform-remove-console"
            );
        }
    }
    return config;
}