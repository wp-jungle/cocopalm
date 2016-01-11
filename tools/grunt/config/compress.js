module.exports = function (grunt, options) {

    var path = require('path'),
        tasks = {};

    // Loop through every plugins
    for (var p = 0; p < options.cocopalm.plugins.length; p++) {

        var currentPlugin = options.cocopalm.plugins[p];
        var currentPluginPath = 'plugins/' + currentPlugin + '/dev';
        var currentReleases = 'plugins/' + currentPlugin + '/releases';
        var currentLatestReleases = 'plugins/' + currentPlugin + '/releases/latest';
        var currentTmpReleases = 'plugins/' + currentPlugin + '/releases/tmp';

        // Create latest zip file
        tasks["latest-" + currentPlugin] = {
            options: {
                archive: currentLatestReleases + '/' + currentPlugin + '.zip'
            },
            expand: true,
            cwd: currentPluginPath,
            src: ['**/*'],
            dest: currentPlugin
        };

        // Create release zip file
        tasks["release-" + currentPlugin] = {
            options: {
                archive: currentReleases + '/' + currentPlugin + '-' + grunt.config('cocopalm.package.' + currentPlugin + '.version') + '.zip'
            },
            expand: true,
            cwd: currentPluginPath,
            src: ['**/*'],
            dest: currentPlugin
        };

    }

    return tasks;

};