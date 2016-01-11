module.exports = function (grunt, options) {

    var tasks = {};

    // Select a plugin to work with
    tasks['plugin'] = {
        options: {
            questions: [
                {
                    config: 'bumper.prompt.plugin',
                    type: 'list',
                    message: 'Plugin to bump and release:',
                    choices: function () {
                        var choices = [];
                        for (var p = 0; p < options.cocopalm.plugins.length; p++) {
                            choices.push({
                                value: options.cocopalm.plugins[p],
                                name: options.cocopalm.plugins[p]
                            });
                        }
                        return choices;
                    }
                }
            ]
        }
    };

    // Bump version and create release
    tasks['release'] = {
        options: {
            questions: [
                {
                    config: 'bumper.prompt.increment',
                    type: 'list',
                    message: 'Bump ' + '<%= bumper.prompt.plugin %>' + ' version from ' + "<%= grunt.config('cocopalm.package.'+grunt.config('bumper.prompt.plugin')+'.version') %>" + ' to:',
                    choices: [
                        {
                            value: 'build',
                            name: 'Build:  ' + ("<%= grunt.config('cocopalm.package.'+grunt.config('bumper.prompt.plugin')+'.version') %>" + '-?') + ' Unstable, betas, and release candidates.'
                        },
                        {
                            value: 'patch',
                            name: 'Patch:  ' + "<%= grunt.semver.inc(grunt.config('cocopalm.package.'+grunt.config('bumper.prompt.plugin')+'.version'), 'patch') %>" + ' Backwards-compatible bug fixes.'
                        },
                        {
                            value: 'minor',
                            name: 'Minor:  ' + "<%= grunt.semver.inc(grunt.config('cocopalm.package.'+grunt.config('bumper.prompt.plugin')+'.version'), 'minor') %>" + ' Add functionality in a backwards-compatible manner.'
                        },
                        {
                            value: 'major',
                            name: 'Major:  ' + "<%= grunt.semver.inc(grunt.config('cocopalm.package.'+grunt.config('bumper.prompt.plugin')+'.version'), 'major') %>" + ' Incompatible API changes.'
                        },
                        {
                            value: 'custom',
                            name: 'Custom version number (format: 0.0.0)'
                        },
                        {
                            value: 'none',
                            name: 'Skip, do not bump versions.'
                        }
                    ]
                },
                {
                    config: 'bumper.prompt.version',
                    type: 'input',
                    message: 'What specific version would you like',
                    when: function (answers) {
                        return answers['bumper.prompt.increment'] === 'custom';
                    },
                    validate: function (value) {
                        var valid = grunt.semver.valid(value);
                        return valid || 'Must be a valid semver, such as 1.2.3-rc1. See http://semver.org/ for more details.';
                    }
                },
                {
                    config: 'bumper.options.prereleaseName',
                    type: 'input',
                    message: 'Enter the pre-release name for your version (eg. 1.2.3-beta):',
                    default: 'beta',
                    when: function (answers) {
                        return ( answers['bumper.prompt.increment'] === 'build' && answers['bumper.prompt.increment'] !== 'none' );
                    },
                    validate: function (value) {
                        var valid = value != "";
                        return valid || 'Please, enter something.';
                    }
                },
                {
                    config: 'bumper.options.files',
                    type: 'checkbox',
                    message: 'What should get the new version for the ' + '<%= bumper.prompt.plugin %>' + ' plugin:',
                    choices: [
                        {
                            value: 'plugins/' + '<%= bumper.prompt.plugin %>' + '/bower.json',
                            name: 'bower.json' + "<%= (!grunt.file.isFile('plugins/'+grunt.config('bumper.prompt.plugin')+'/bower.json') ? ' (not found)' : '') %>",
                            checked: true
                        },
                        {
                            value: 'plugins/' + '<%= bumper.prompt.plugin %>' + '/composer.json',
                            name: 'composer.json' + "<%= (!grunt.file.isFile('plugins/'+grunt.config('bumper.prompt.plugin')+'/composer.json') ? ' (not found)' : '') %>",
                            checked: true
                        },
                        {
                            value: 'plugins/' + '<%= bumper.prompt.plugin %>' + '/grunt.json',
                            name: 'grunt.json' + "<%= (!grunt.file.isFile('plugins/'+grunt.config('bumper.prompt.plugin')+'/grunt.json') ? ' (not found)' : '') %>",
                            checked: true
                        },
                        {
                            value: 'Plugin main php file',
                            name: 'Plugin main php file',
                            checked: true
                        }
                    ],
                    when: function (answers) {
                        return answers['bumper.prompt.increment'] !== 'none';
                    }
                },
                {
                    config: 'bumper.options.commit',
                    type: 'confirm',
                    message: 'Should bump changes be committed ?',
                    default: false,
                    when: function (answers) {
                        return answers['bumper.prompt.increment'] !== 'none';
                    }
                },
                {
                    config: 'bumper.options.createTag',
                    type: 'confirm',
                    message: 'Create a new tag ?',
                    default: false,
                    when: function (answers) {
                        return answers['bumper.prompt.increment'] !== 'none';
                    }
                },
                {
                    config: 'bumper.options.push',
                    type: 'confirm',
                    message: 'Push commited files to repository ?',
                    default: false,
                    when: function (answers) {
                        return answers['bumper.prompt.increment'] !== 'none';
                    }
                }
            ],
            then: function (results) {

                if (results['bumper.prompt.increment'] !== 'none') {

                    // Update configs
                    grunt.config('bump.options.createTag', results['bumper.options.createTag']);
                    grunt.config('bump.options.push', results['bumper.options.push']);
                    grunt.config('bump.options.commit', results['bumper.options.commit']);
                    grunt.config('bump.options.files', ['plugins/' + grunt.config('bumper.prompt.plugin') + '/package.json']);
                    grunt.config('bump.options.commitFiles', ['*']);
                    grunt.config('bump.options.updateConfigs', ['cocopalm.package.' + grunt.config('bumper.prompt.plugin')]);
                    if (results['bumper.prompt.increment'] === 'build') {
                        grunt.config('bump.options.prereleaseName', results['bumper.options.prereleaseName']);
                    }

                    // Bump plugin package.json file
                    if (results['bumper.prompt.increment'] === 'custom') {
                        // Run task with custom number
                        grunt.task.run([
                            'bump-only --setversion=' + results['bumper.prompt.version']
                        ]);
                    } else {
                        // Run task from bump type
                        grunt.task.run([
                            'bump-only:' + results['bumper.prompt.increment']
                        ]);
                    }

                    // Update bower.json file if prompted to
                    if (results['bumper.options.files'].indexOf('plugins/' + grunt.config('bumper.prompt.plugin') + '/bower.json') !== -1) {
                        grunt.task.run([
                            'replace:bower-' + grunt.config('bumper.prompt.plugin')
                        ]);
                    }

                    // Update composer.json file
                    if (results['bumper.options.files'].indexOf('plugins/' + grunt.config('bumper.prompt.plugin') + '/composer.json') !== -1) {
                        grunt.task.run([
                            'replace:composer-' + grunt.config('bumper.prompt.plugin')
                        ]);
                    }

                    // Update grunt.json file
                    if (results['bumper.options.files'].indexOf('plugins/' + grunt.config('bumper.prompt.plugin') + '/grunt.json') !== -1) {
                        grunt.task.run([
                            'replace:grunt-' + grunt.config('bumper.prompt.plugin')
                        ]);
                    }

                    // Update plugin.php file
                    if (results['bumper.options.files'].indexOf('Plugin main php file') !== -1) {
                        grunt.task.run([
                            'replace:plugin-' + grunt.config('bumper.prompt.plugin')
                        ]);
                    }

                    // Compile changelog
                    //grunt.task.run([
                    //'conventionalChangelog',
                    //'shell:changelog'
                    //]);

                    // Commit changes
                    grunt.task.run([
                        'bump-commit'
                    ]);
                }

                // Clean release tmp directory
                grunt.task.run([
                    'clean:release-' + grunt.config('bumper.prompt.plugin')
                ]);

                // Make ZIP File
                grunt.task.run([
                    'compress:latest-' + grunt.config('bumper.prompt.plugin'),
                    'compress:release-' + grunt.config('bumper.prompt.plugin')
                ]);
            }
        }

    };

    return tasks;

};
