<?php

namespace Sample\Core;
use Bamboo\Assets\AssetsRegistrationDelegate;

/**
 * Class FrontendExtension
 * @package Sample\Core
 *
 *          Manage styles, scripts, etc.
 */
class FrontendExtension implements AssetsRegistrationDelegate
{
    public static $HANDLE_SAMPLE_CSS = 'sample-frontend-styles';
    public static $HANDLE_ISOTOPE_JS = 'isotope';

    /**
     * Constructor
     *
     * @param \Bamboo\Assets\AssetsManager $assetsManager
     */
    public function __construct($assetsManager)
    {
        if ( !is_admin())
        {
            $assetsManager->addRegistrationDelegate($this);
        }
    }

    /**
     * Perform registration of all assets which may be required by your plugin.
     *
     * @param \Bamboo\Assets\AssetsManager $assetManager The asset manager to do the heavy lifting
     */
    public function registerAssets($assetManager)
    {
        if ( !get_theme_support('sample-styles'))
        {
            $cssExt = SAMPLE_DEBUG_ASSETS ? '.css' : '.min.css';

            // OUR CSS
            $relativeUrl = 'assets/css/styles' . $cssExt;
            $assetManager->registerStyle(
                self::$HANDLE_SAMPLE_CSS,
                SAMPLE_URL . '/' . $relativeUrl,
                $relativeUrl
            );

            // For now always include the showcase styles on any page
            $assetManager->requireStyle(self::$HANDLE_SAMPLE_CSS);
        }

        if ( !get_theme_support('sample-scripts'))
        {
            $jsExt = SAMPLE_DEBUG_ASSETS ? '.js' : '.min.js';

            // ISOTOPE
            $relativeUrl = 'assets/js/vendor/isotope' . $jsExt;
            $assetManager->registerScript(
                self::$HANDLE_ISOTOPE_JS,
                SAMPLE_URL . '/' . $relativeUrl,
                $relativeUrl,
                array('jquery'),
                '2.2.0',
                true);
        }
    }
}