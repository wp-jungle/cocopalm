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

            // Dev Task
            tasks["dev-" + name] = {
                options: {
                    sourceMap: true,
                    compress: false,
                    yuicompress: false,
                    sourceMapFilename: currentPluginPath + '/assets/css/' + name + '.css.map',
                    sourceMapURL: name + '.css.map',
                    sourceMapRootpath: '/app/',
                    sourceMapBasepath: 'src/'
                },
                files: {}
            };
            tasks["dev-" + name]['files'][currentPluginPath + '/assets/css/' + name + '.css'] = options.cocopalm.assets[currentPlugin].styles[i].abspath;

            // Dist Task
            tasks["dist-" + name] = {
                options: {
                    "compress": true,
                    "yuicompress": true,
                    "optimization": 2,
                    "sourceMap": false
                },
                files: {}
            };
            tasks["dist-" + name]['files'][currentPluginPath + '/assets/css/' + name + '.min.css'] = options.cocopalm.assets[currentPlugin].styles[i].abspath;
        }

    }

    return tasks;

};
