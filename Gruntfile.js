module.exports = function (grunt) {

    var time = require('time-grunt')(grunt),
        path = require('path');

    require('load-grunt-config')(grunt, {
        configPath: path.join(process.cwd(), 'tools/grunt/config'),
        customPath: path.join(process.cwd(), 'tools/grunt/override'),
        init: true,
        data: {
            pkg: grunt.file.readJSON('package.json')
        },
        jitGrunt: {
            staticMappings: {
                '_functions': '',
                'makepot': 'grunt-wp-i18n',
                'bump-only': 'grunt-bump'
            }
        }
    });
};