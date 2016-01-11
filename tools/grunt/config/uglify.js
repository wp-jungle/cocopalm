module.exports = function (grunt, options) {

    var path = require('path'),
        tasks = {};

    // Loop through every plugins
    for (var p = 0; p < options.cocopalm.plugins.length; p++) {

        var currentPlugin = options.cocopalm.plugins[p];
        var currentPluginPath =  'plugins/' + currentPlugin + '/dev';

        // Create options for all registered JS files
        for (var i = 0; i < options.cocopalm.assets[currentPlugin].scripts.length; i++) {
            var name = options.cocopalm.assets[currentPlugin].scripts[i].name;

            // Dev Task
            tasks["dev-" + name] = {
                options: {
                    sourceMap: true,
                    compress: false,
                    mangle: false,
                    beautify: true,
                    sourceMapFilename: currentPluginPath + '/assets/js/' + name + '.js.map',
                    sourceMapURL: name + '.js.map',
                    sourceMapRootpath: '/app/',
                    sourceMapBasepath: 'src/'
                },
                files: {}
            };
            tasks["dev-" + name]['files'][currentPluginPath + '/assets/js/' + name + '.js'] = options.cocopalm.assets[currentPlugin].scripts[i].abspath;

            // Dist Task
            tasks["dist-" + name] = {
                options: {
                    sourceMap: false,
                    mangle: {
                        except: ['jQuery', '$']
                    }
                },
                files: {}
            };
            tasks["dist-" + name]['files'][currentPluginPath + '/assets/js/' + name + '.min.js'] = options.cocopalm.assets[currentPlugin].scripts[i].abspath;
        }

    }

    return tasks;

};