module.exports = function (grunt, options) {

    var path = require('path'),
        tasks = {};

    // Loop through every plugins
    for (var p = 0; p < options.cocopalm.plugins.length; p++) {

        var currentPlugin = options.cocopalm.plugins[p];
        var currentPluginPath =  'plugins/' + currentPlugin + '/dev';

        tasks[currentPlugin] = {
            options: {
                algo: "md5",
                cwd: currentPluginPath,
                format: "json"
            },
            src: ["assets/js/*.js", "assets/css/*.css"],
            dest: "assets/manifest.json"
        };
    }

    return tasks;

};