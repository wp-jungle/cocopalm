module.exports = function (grunt, options) {

    var path = require('path'),
        tasks = {};

    // Loop through every plugins
    for (var p = 0; p < options.cocopalm.plugins.length; p++) {

        var currentPlugin = options.cocopalm.plugins[p];
        var currentPluginPath =  'plugins/' + currentPlugin + '/dev';

        // Create options for all registered LESS files
        for (var i = 0; i < options.cocopalm.assets[currentPlugin].styles.length; i++) {
            var name = options.cocopalm.assets[currentPlugin].styles[i].name;

            // Watch Scripts Task
            tasks["scripts-" + currentPlugin + "-" + name] = {
                files: [
                    currentPluginPath + '/assets/js/src/*.js',
                    currentPluginPath + '/assets/js/src/**/*.js',
                    currentPluginPath + '/vendor/**/*.js'
                ],
                tasks: ['uglify:dev-' + currentPlugin, 'hash-manifest:' + currentPlugin],
                options: {
                    spawn: false
                }
            };

            // Watch Syles Task
            tasks["styles-" + currentPlugin + "-" + name] = {
                files: [
                    currentPluginPath + '/assets/css/src/*.less',
                    currentPluginPath + '/assets/css/src/**/*.less'
                ],
                tasks: ['less:dev' + currentPlugin, 'autoprefixer:' + currentPlugin, 'hash-manifest:' + currentPlugin],
                options: {
                    spawn: false
                }
            };
        }
    }
};