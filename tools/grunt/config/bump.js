module.exports = function (grunt, options) {

    var path = require('path'),
        tasks = {};

    tasks['options'] = {
        files: [],
        updateConfigs: [],
        commit: false,
        commitMessage: "",
        commitFiles: [],
        createTag: false,
        tagName: "",
        tagMessage: "",
        push: false,
        pushTo: "origin",
        gitDescribeOptions: "--tags --always --abbrev=1 --dirty=-d",
        globalReplace: false,
        prereleaseName: "beta",
        regExp: false
    };

};