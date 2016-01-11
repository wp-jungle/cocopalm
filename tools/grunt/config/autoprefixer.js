module.exports = function (grunt, options) {

    var path = require('path'),
        tasks = {};

    tasks["options"] = {
        browsers: ['last 3 versions, > 2%'],
        silent: true,
        cascade: false // We have minified CSS...
    };

    // Loop through every plugins
    for (var p = 0; p < options.cocopalm.plugins.length; p++) {

        var currentPlugin = options.cocopalm.plugins[p];
        var currentPluginPath =  'plugins/' + currentPlugin + '/dev';

        tasks[currentPlugin] = {
            src: [
                currentPluginPath + "/assets/css/*.css"
            ]
        };
    }

    return tasks;

};