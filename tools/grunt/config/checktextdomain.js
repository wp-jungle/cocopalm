module.exports = function (grunt, options) {

    var path = require('path'),
        tasks = {};

    // Loop through every plugins
    for (var p = 0; p < options.cocopalm.plugins.length; p++) {

        var currentPlugin = options.cocopalm.plugins[p];
        var currentPluginPath =  'plugins/' + currentPlugin + '/dev';

        tasks[currentPlugin] = {
            options: {
                text_domain: options.cocopalm.grunt[currentPlugin].i18n.textDomain,
                correct_domain: true,
                keywords: options.cocopalm.grunt[currentPlugin].i18n.keywords
            },
            files: [{
                src: [
                    currentPluginPath + "/*.php",
                    currentPluginPath + "/src/**/*.php"
                ],
                expand: true
            }]
        };
    }

    return tasks;
};