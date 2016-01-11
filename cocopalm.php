<?php
!defined('ABSPATH') AND exit();
/*
Plugin Name:    CocoPalm
Plugin URI:     http://wp-jungle.com
Description:    A WordPress plugin for developing others plugins
Author:         Thomas Lartaud
Author URI:     http://thomaslartaud.com
Version:        1.0.0
*/

if (!class_exists('CocoPalm')) {

    add_action( 'plugins_loaded', array( 'CocoPalm', 'init' ), 0 );

    class CocoPalm
    {

        /**
         * Instance
         *
         * @access protected
         * @var object
         */
        static protected $instance;

        /**
         * The files that need to get included
         *
         * @var     array string Class Name w/o prefix (Hint: Naming convention!) Use the value to define if need to hook the class.
         */
        protected $includes = array();

        /**
         * Creates a new static instance
         *
         * @since  0.8
         * @static
         */
        static public function init()
        {
            null === self::$instance AND self::$instance = new self;
            return self::$instance;
        }

        /**
         * Constructor
         *
         * @since  1.0.0
         * @access public
         */
        public function __construct()
        {
            // Don't use this plugin on production sites
            if (defined('WP_ENV') && WP_ENV == 'development') {

                // Declare constants
                define('COCOPALM_VERSION', '1.0.0');
                define('COCOPALM_DIR', untrailingslashit(dirname(__FILE__)));
                define('COCOPALM_BASENAME', basename(COCOPALM_DIR));
                define('COCOPALM_URL', untrailingslashit(plugin_dir_url(__FILE__)));
                define('COCOPALM_PLUGINS_DIR', COCOPALM_DIR . '/plugins');
                define('COCOPALM_PLUGINS_BASENAME', COCOPALM_BASENAME . '/' . basename(COCOPALM_PLUGINS_DIR));

                // Start
                $this->updatePluginsFiles();
                $this->includePluginsFiles();
            }
        }

        /**
         * Load every scanned file
         */
        public function includePluginsFiles()
        {
            // Auto-loads
            foreach ($this->includes as $plugin) {
                // Load file: trailingslashed by core
                # Tested: calling plugin_dir_path() directly saves 1/2 time
                # instead of saving the plugin_dir_path() in a $var and recalling here
                require_once plugin_dir_path(__FILE__) . "plugins/{$plugin['path']}";
                if (!$plugin['init'])
                    continue;
                // Build class name
                $class = "CocoPalm_" . ucwords($plugin['name']);
                class_exists($class) AND add_action('plugins_loaded', array($class, 'instance'));
            }

            // Register
            $this->registerPluginsDirectories();
        }

        /**
         * Scan `plugins/` directory function
         *
         * The function below will allow you to specify if you want to return full paths, or relative paths
         * There is also an option to return only file names.
         *
         * @param   $dir
         * @param   bool|false $onlyfiles
         * @param   bool|false $fullpath
         * @return  array|bool
         */
        protected function scanDirectories($dir, $onlyfiles = false, $fullpath = false)
        {
            if (isset($dir) && is_readable($dir)) {
                $dlist = Array();
                $dir = realpath($dir);
                if ($onlyfiles) {
                    $objects = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
                } else {
                    $objects = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir), RecursiveIteratorIterator::SELF_FIRST);
                }

                foreach ($objects as $entry => $object) {
                    if (!$fullpath) {
                        $entry = str_replace($dir, '', $entry);
                    }

                    $dlist[] = $entry;
                }

                return $dlist;
            }
            return false;
        }

        /**
         * Update allowed plugins list in current development
         *
         * @since  1.0.0
         * @return array
         */
        public function updatePluginsFiles()
        {
            $plugins = $this->scanDirectories(COCOPALM_PLUGINS_DIR, false, false);
            $list = [];
            foreach ($plugins as $file) {
                $matches = "";
                if (preg_match('/^(\/)([a-zA-Z\-\_0-9]*)(\/)(dev\/)([a-zA-Z\-\_0-9]*)(\.php)/i', $file, $matches)) {
                    $plugin = $this->getComments($file);
                    if (!empty($plugin['Plugin Name']))
                        $list[] = apply_filters(
                            'cocopalm/allowedPlugins?plugin=' . $matches[2], array(
                                'init' => true,
                                'dir' => $matches[2],
                                'file' => $matches[5] . $matches[6],
                                'path' => $matches[2] . '/dev/' . $matches[5] . $matches[6],
                                'label' => (!empty($plugin['Description']) ? $plugin['Description'] : 'No description') . ' (loaded by CocoPalm)'
                            )
                        );
                }
            }
            $this->includes = $list;

        }

        /**
         * Read PHP file comment
         *
         * @param $filename
         * @return mixed
         */
        protected function getComments($filename)
        {
            $params = array();
            $matches = array();
            $docComments = array_filter(token_get_all(file_get_contents(COCOPALM_PLUGINS_DIR . $filename)), function($entry)
            {
                return $entry[0] == T_COMMENT;
            });
            $fileDocComment = array_shift($docComments);

            $default_headers = array(
                'Name'        => 'Plugin Name',
                'PluginURI'   => 'Plugin URI',
                'Version'     => 'Version',
                'Description' => 'Description',
                'Author'      => 'Author',
                'AuthorURI'   => 'Author URI',
                'TextDomain'  => 'Text Domain',
                'DomainPath'  => 'Domain Path',
                'Network'     => 'Network'
            );

            $regexp = '/^(';
            $regexpHeaders = array();
            foreach($default_headers as $key => $doc){
                $regexpHeaders[] = $doc;
            }
            $regexp .= join("|", $regexpHeaders);
            $regexp .= ')(\:[\s|\t]*)(.*)$/im';

            preg_match_all($regexp, $fileDocComment[1], $matches);

            for($i = 0; $i < sizeof($matches[0]); $i++)
            {
                $params[$matches[1][$i]] = $matches[3][$i];
            }

            return $params;
        }

        /**
         * Registers a new plugin directory
         *
         * @example
         * $args Array (Valid args for `root`) 'content', 'plugins', 'muplugins', 'root'
         * The new directories must be subdirectories of the following WP file system constants:
         * 'content':   (default) WP_CONTENT_DIR
         * 'plugins':   WP_PLUGIN_DIR
         * 'muplugins': WPMU_PLUGIN_DIR
         * 'root':      one level below WP_CONTENT_DIR
         *
         * @return void
         */
        protected function registerPluginsDirectories()
        {
            // Better abort - if we don't do this, we'll create an error on deactivation of the main plugin.
            if (!function_exists('register_plugin_directory'))
                return;

            // Call the public API function once for every directory
            foreach ($this->includes as $plugin) {
                register_plugin_directory(array(
                        'dir' => $plugin['dir'],
                        'label' => $plugin['label'],
                        'root' => 'plugins'
                    )
                );
            }
        }

    }
}
