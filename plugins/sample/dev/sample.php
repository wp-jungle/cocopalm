<?php
/*
Plugin Name: Sample
Plugin URI: http://wordpress.org/extend/plugins/sample/
Description: Sample plugin for CocoPalm plugin builder
Author: Firstname Lastname
Author URI: http://company.com
Version: 0.0.1
*/

use Bamboo\Activation\ActivationManager;
use Sample\Core\ActivationDelegate;

define('SAMPLE_VERSION', '1.0.0');

define('SAMPLE_DIR', untrailingslashit(dirname(__FILE__)));
define('SAMPLE_URL', untrailingslashit(plugin_dir_url(__FILE__)));
define('SAMPLE_VENDOR_DIR', SAMPLE_DIR . '/vendor');
define('SAMPLE_VIEWS_DIR', SAMPLE_DIR . '/src/Views');
define('SAMPLE_ASSETS_URL', SAMPLE_URL . '/assets');

if ( !defined('SAMPLE_DEBUG_TEMPLATES')) define('SAMPLE_DEBUG_TEMPLATES', false);
if ( !defined('SAMPLE_DEBUG_ASSETS')) define('SAMPLE_DEBUG_ASSETS', false);

// Autoload the plugin classes
include_once('vendor/autoload.php');

// Some hooks for activation, deactivation, ...
ActivationManager::setup(__FILE__, 'sample', new ActivationDelegate());

// Let's go
\Sample\Core\Sample::instance();