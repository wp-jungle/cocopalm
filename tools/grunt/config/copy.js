module.exports = function (grunt, options) {

    var path = require('path'),
        tasks = {};

    // Loop through every plugins
    for (var p = 0; p < options.cocopalm.plugins.length; p++) {

        var currentPlugin = options.cocopalm.plugins[p];
        var currentPluginPath =  'plugins/' + currentPlugin + '/dev';
        var currentPluginReleases =  'plugins/' + currentPlugin + '/releases';
        var currentTmpReleases =  'plugins/' + currentPlugin + '/releases/tmp';

        tasks[currentPlugin] = {
            files: [
                // includes files within path and its sub-directories
                {expand: true, src: [currentPluginPath + '/**'], dest: currentTmpReleases}
            ]
        };
    }

    return tasks;
};