module.exports = function (grunt, options) {

    var path = require('path'),
        tasks = {};

    tasks['release'] = [];

    // Loop through every plugins
    for (var p = 0; p < options.cocopalm.plugins.length; p++) {

        var currentPlugin = options.cocopalm.plugins[p];
        var currentPluginTmpReleases =  'plugins/' + currentPlugin + '/tmp/latest';

        var paths = [currentPluginTmpReleases + "/*", "!/" + currentPluginTmpReleases + "/.gitkeep"];
        tasks['release-' + currentPlugin] = paths;
        tasks['release'].push(paths);
    }

    return tasks;
};