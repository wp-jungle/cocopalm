<?php

namespace Sample\Core;

use Bamboo\Assets\AssetsRegistrationDelegate;

/**
 * Class AdminExtension
 * @package Sample\Core
 *
 *          Manage styles, scripts, etc.
 */
class AdminExtension implements AssetsRegistrationDelegate
{
    public static $HANDLE_SAMPLE_CSS = 'sample-admin-styles';

    /**
     * Constructor
     *
     * @param \Bamboo\Assets\AssetsManager $assetsManager
     */
    public function __construct($assetsManager)
    {
        if (is_admin())
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
        $cssExt = SAMPLE_DEBUG_ASSETS ? '.css' : '.min.css';
        $relativeUrl = 'assets/css/admin' . $cssExt;

        $assetManager->registerStyle(
            self::$HANDLE_SAMPLE_CSS,
            SAMPLE_URL . '/' . $relativeUrl,
            $relativeUrl
        );

        // For now always include the showcase styles on any page
        $assetManager->requireStyle(self::$HANDLE_SAMPLE_CSS);
    }

}