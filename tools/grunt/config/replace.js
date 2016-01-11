module.exports = function (grunt, options) {

    var path = require('path'),
        tasks = {};

    // Loop through every plugins
    for (var p = 0; p < options.cocopalm.plugins.length; p++) {

        var currentPlugin = options.cocopalm.plugins[p];
        var currentPluginPath = 'plugins/' + currentPlugin + '/dev';

        // Replace Bower version
        tasks["bower-" + currentPlugin] = {
            src: currentPluginPath + 'bower.json',
            overwrite: true,
            replacements: [
                {
                    from: /^(\s*|\t*)(")?[vV]ersion(")?:(.)*/g,
                    to: '$1"version": "<%= cocopalm.package.' + currentPlugin + '.version %>"'
                }
            ]
        };

        // Replace Composer version
        tasks["composer-" + currentPlugin] = {
            src: currentPluginPath + 'composer.json',
            overwrite: true,
            replacements: [
                {
                    from: /^(\s*|\t*)(")?[vV]ersion(")?:(.)*/g,
                    to: '$1"version": "<%= cocopalm.package.' + currentPlugin + '.version %>"'
                }
            ]
        };

        // Replace Grunt version
        tasks["grunt-" + currentPlugin] = {
            src: currentPluginPath + 'grunt.json',
            overwrite: true,
            replacements: [
                {
                    from: /^(\s*|\t*)(")?[vV]ersion(")?:(.)*/g,
                    to: '$1"version": "<%= cocopalm.package.' + currentPlugin + '.version %>"'
                }
            ]
        };

        // Replace Plugin version
        tasks["plugin-" + currentPlugin] = {
            src: currentPluginPath + '/dev/' + options.cocopalm.grunt[currentPlugin].i18n.mainFile,
            overwrite: true,
            replacements: [
                {
                    from: /^(\s*|\t*)(")?[vV]ersion(")?:(.)*/g,
                    to: '$1"version": "<%= cocopalm.package.' + currentPlugin + '.version %>"'
                }
            ]
        };

    }

    return tasks;

};