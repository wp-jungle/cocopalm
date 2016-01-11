CocoPalm
========

**CocoPalm** (Grunt engine) is an awesome tree that makes coco nuts (WP plugins), ready to be compiled and released
in a coco shell (ZIP file).

Requirements
------------

- PHP `>= 5.5.8`
- NodeJs `>= 4.1.1`
- Grunt
- Composer
- Bower

Included plugins
----------------

- `sample`


Start
-----

- Run `npm install`
- Run `grunt build`


Grunt commands
--------------

- `grunt build[:{plugin}]`
  - `grunt exec[:{plugin}]`
  - `grunt checktextdomain[:{plugin}]`
  - `grunt makepot[:{plugin}]`
  - `grunt uglify[:(dev/dist)-{plugin}]`
  - `grunt less[:(dev/dist)-{plugin}]`
  - `grunt autoprefixer[:{plugin}]`
  - `grunt hash-manifest[:{plugin}]`
- `grunt release`
- `grunt watch:(scripts/styles)-{plugin}`

`[]` optional

`{plugin}` plugin slug

`($1/$2)` choose between one of the argument

Changelog
---------

### 11/01/2016

- Add a `Sample` plugin to show what we can do
- Allow **CocoPalm** to be installed as a WP-Plugin and autoload plugins that are currently in development


Todo
----

- Build task should be built with prompt (like release task) to allow user to select the plugin to work with
- Fix grunt watch task
- Add a `grunt add-plugin` task to automatically create a new default plugin from arguments
- Add plugins via repositories so we can add tasks to push to repository while bumping


Enjoy
-----

And now, **shake the CocoPalm and knock off some CocoNuts!**