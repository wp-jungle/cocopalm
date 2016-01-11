/**
 * PHP-like print_r() equivalent for JavaScript Object
 *
 * @author Faisalman <fyzlman@gmail.com>
 * @license http://www.opensource.org/licenses/mit-license.php
 * @link http://gist.github.com/879208
 */
var print_r = function (obj, t) {

    // define tab spacing
    var tab = t || '';

    // check if it's array
    var isArr = Object.prototype.toString.call(obj) === '[object Array]';

    // use {} for object, [] for array
    var str = isArr ? ('Array\n' + tab + '[\n') : ('Object\n' + tab + '{\n');

    // walk through it's properties
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            var val1 = obj[prop];
            var val2 = '';
            var type = Object.prototype.toString.call(val1);
            switch (type) {

                // recursive if object/array
                case '[object Array]':
                case '[object Object]':
                    val2 = print_r(val1, (tab + '\t'));
                    break;

                case '[object String]':
                    val2 = '\'' + val1 + '\'';
                    break;

                default:
                    val2 = val1;
            }
            str += tab + '\t' + prop + ' => ' + val2 + ',\n';
        }
    }

    // remove extra comma for last property
    str = str.substring(0, str.length - 2) + '\n' + tab;

    return isArr ? (str + ']') : (str + '}');
};

module.exports = function (grunt, options) {

    // Initialize
    var path = require('path'),
        cocopalm = {plugins: [], assets: {}, grunt: {}, bower: {}, composer: {}, package: {}},
        currentPlugin = "";

    // Dynamically read Plugins source folder and store paths
    // Plugin must have a grunt.json file
    grunt.file.recurse('plugins', function (abspath, rootdir, subdir, filename) {
        if (subdir && subdir.substring(0, subdir.indexOf('/'))) {
            subdir = subdir.substring(0, subdir.indexOf('/')) ;
        }
        if ((abspath === rootdir + "/" + subdir + "/" + filename) && filename.match(/^(grunt)\.(json)$/)) {
            cocopalm.plugins.push(subdir);
            cocopalm.assets[subdir] = {
                styles: [],
                scripts: []
            };
            cocopalm.bower[subdir] = grunt.file.readJSON(rootdir + "/" + subdir + "/dev/bower.json");
            cocopalm.composer[subdir] = grunt.file.readJSON(rootdir + "/" + subdir + "/dev/composer.json");
            cocopalm.grunt[subdir] = grunt.file.readJSON(rootdir + "/" + subdir + "/grunt.json");
            cocopalm.package[subdir] = grunt.file.readJSON(rootdir + "/" + subdir + "/package.json");
        }
    });

    // Loop through every plugins and read files
    for (var i = 0; i < cocopalm.plugins.length; i++) {

        currentPlugin = cocopalm.plugins[i];

        // Dynamically read JS plugin source folder and store paths
        if (grunt.file.exists('plugins/' + currentPlugin + '/dev/assets/js/src')) {
            grunt.file.recurse('plugins/' + currentPlugin + '/dev/assets/js/src', function (abspath, rootdir, subdir, filename) {
                if ((abspath === rootdir + "/" + filename) && filename.match(/^[_][0-9a-zA-Z\-\_]*.js$/g)) {
                    var name = filename.substring(0, filename.lastIndexOf('.')).slice(1);
                    cocopalm.assets[currentPlugin].scripts.push({
                        name: name,
                        abspath: abspath,
                        rootdir: rootdir,
                        subdir: subdir,
                        filename: filename
                    });
                }
            });
        }

        // Dynamically read LESS plugin source folder and store paths
        if (grunt.file.exists('plugins/' + currentPlugin + '/dev/assets/css/src')) {
            grunt.file.recurse('plugins/' + currentPlugin + '/dev/assets/css/src', function (abspath, rootdir, subdir, filename) {
                if ((abspath === rootdir + "/" + filename) && filename.match(/^[_][0-9a-zA-Z\-\_]*.less$/g)) {
                    var name = filename.substring(0, filename.lastIndexOf('.')).slice(1);
                    cocopalm.assets[currentPlugin].styles.push({
                        name: name,
                        abspath: abspath,
                        rootdir: rootdir,
                        subdir: subdir,
                        filename: filename
                    });
                }
            });
        }

    }

    // Pass the data to grunt
    options.cocopalm = cocopalm;
    grunt.config('cocopalm', cocopalm);

    // Pass semver to grunt (required for prompt task to work)
    grunt.semver = require('semver');
};