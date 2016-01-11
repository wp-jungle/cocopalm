<?php

namespace Sample\Core;

use Bamboo\Activation\ActivationManager;
use Bamboo\Assets\AssetsManager;
use Bamboo\Models\ModelManager;
use Bamboo\Templates\TemplateEngine;

/**
 * Class Sample
 * @package Sample\Core
 *
 *          The main plugin facade. This is a singleton, there can only be a single instance.
 */
class Sample
{
    /** @var Sample The unique instance */
    private static $instance = null;

    /**
     * The Unique instance of the main facade to access core objects
     *
     * @return Sample
     */
    public static function instance()
    {
        if (self::$instance == null)
        {
            self::$instance = new Sample();
        }

        return self::$instance;
    }

    /** @var TemplateEngine */
    private $templateEngine;

    /** @var ModelManager */
    private $modelManager;

    /** @var AssetsManager */
    private $assetsManager;

    /** @var FrontendExtension */
    private $frontendExtension;

    /** @var AdminExtension */
    private $adminExtension;

    /** @var ActivationManager */
    private $activationManager;

    /**
     * Constructor
     */
    private function __construct()
    {
        $this->activationManager = new ActivationManager();
        $this->modelManager = new ModelManager(array('Sample\\Models\\ProjectModel'));
        $this->templateEngine = new TemplateEngine('sample', SAMPLE_DEBUG_TEMPLATES);

        $this->assetsManager = new AssetsManager(SAMPLE_DIR . '/assets/manifest.json', SAMPLE_VERSION);
        $this->frontendExtension = new FrontendExtension($this->assetsManager);
        $this->adminExtension = new AdminExtension($this->assetsManager);
    }

    /**
     * @return TemplateEngine The template engine
     */
    public function templates()
    {
        return $this->templateEngine;
    }

    /**
     * @return ModelManager The model manager
     */
    public function models()
    {
        return $this->modelManager;
    }

    /**
     * @return AssetsManager The frontend extension
     */
    public function assets()
    {
        return $this->assetsManager;
    }

    /**
     * @return FrontendExtension The frontend extension
     */
    public function frontend()
    {
        return $this->frontendExtension;
    }

    /**
     * @return FrontendExtension The frontend extension
     */
    public function admin()
    {
        return $this->adminExtension;
    }
}