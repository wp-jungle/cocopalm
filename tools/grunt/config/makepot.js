module.exports = function (grunt, options) {

    var path = require('path'),
        tasks = {},
        excluded_meta = [
            "Plugin Name of the plugin/theme",
            "Plugin URI of the plugin/theme",
            "Author of the plugin/theme",
            "Author URI of the plugin/theme"
        ],
        processPot = [],
        poInclude = [],
        poExclude = [];

    // Loop through every plugins
    for (var p = 0; p < options.cocopalm.plugins.length; p++) {

        var currentPlugin = options.cocopalm.plugins[p];
        var currentPluginPath =  'plugins/' + currentPlugin + '/dev';

        poInclude[currentPlugin] = [
            options.cocopalm.grunt[currentPlugin].i18n.mainFile,
            "src/.*"
        ];

        poExclude[currentPlugin] = [
            "assets/.*",
            "languages/.*",
            "lib/.*",
            "vendor/.*"
        ];

        processPot[currentPlugin] = function (pot) {

            var plugin = pot.headers["project-id-version"].split(" ");
            plugin = plugin[0].toLowerCase();

            pot.headers["Plural-Forms"] = "nplurals=INTEGER; plural=EXPRESSION;" + "\n";
            pot.headers["report-msgid-bugs-to"] = options.cocopalm.package[plugin].bugs.url + "\n";
            pot.headers["last-translator"] = options.cocopalm.package[plugin].author.name + " <" + options.cocopalm.package[plugin].author.email + ">\n";
            pot.headers["language-team"] = options.cocopalm.package[plugin].author.url + "\n";
            pot.headers["language"] = "en_US";
            pot.headers["X-Poedit-Country"] = "United States" + "\n";
            pot.headers["X-Poedit-WPHeader"] = options.cocopalm.grunt[plugin].i18n.mainFile;
            pot.headers['X-Poedit-Basepath'] = ".." + "\n";
            pot.headers['X-Poedit-SourceCharset'] = "UTF-8" + "\n";
            pot.headers['X-Poedit-Bookmarks'] = "\n";
            pot.headers['X-Textdomain-Support'] = "yes" + "\n";
            pot.headers["X-Poedit-keywordslist"] = options.cocopalm.grunt[plugin].i18n.keywords.join(';') + "\n";

            for (var i = 0; i < poInclude[plugin].length; i++) {
                pot.headers['X-Poedit-SearchPath-' + i] = poInclude[plugin][i] + "\n";
            }

            for (var j = 0; j < poExclude[plugin].length; j++) {
                pot.headers['X-Poedit-SearchPathExcluded-' + j] = poExclude[plugin][j] + "\n";
            }

            for (var translation in pot.translations[""]) {
                if ("undefined" !== typeof pot.translations[""][translation].comments.extracted) {
                    if (excluded_meta.indexOf(pot.translations[""][translation].comments.extracted) >= 0) {
                        console.log("Excluded meta: " + pot.translations[""][translation].comments.extracted);
                        delete pot.translations[""][translation];
                    }
                }
            }
            return pot;
        };

        tasks[currentPlugin] = {
            options: {
                cwd: currentPluginPath,
                domainPath: "languages",
                mainFile: options.cocopalm.grunt[currentPlugin].i18n.mainFile,
                potFilename: options.cocopalm.grunt[currentPlugin].i18n.textDomain + ".pot",
                processPot: processPot[currentPlugin],
                include: poInclude[currentPlugin],
                exclude: poExclude[currentPlugin],
                potComments: "(c) " + options.cocopalm.package[currentPlugin].author.name + " {{year}}",
                potHeaders: {
                    poedit: false,
                    "x-poedit-keywordslist": false
                },
                type: "wp-plugin",
                updateTimestamp: false,
                updatePoFiles: true
            }
        };

    }

    return tasks;

};