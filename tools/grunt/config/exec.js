module.exports = function (grunt, options) {

    var path = require('path'),
        tasks = {};

    // Loop through every plugins
    for (var p = 0; p < options.cocopalm.plugins.length; p++) {

        var currentPlugin = options.cocopalm.plugins[p];
        var currentPluginPath = 'plugins/' + currentPlugin + '/dev';

        tasks['composer-' + currentPlugin] = {
            command: 'echo Running composer install on ' + currentPlugin + ' plugin. && cd "' + currentPluginPath + '" && composer update"',
            options: {stdout: true}
        };

        tasks['bower-' + currentPlugin] = {
            command: 'echo Running bower install on ' + currentPlugin + ' plugin. && cd "' + currentPluginPath + '" && bower install"',
            options: {stdout: true}
        };
    }

    return tasks;
};