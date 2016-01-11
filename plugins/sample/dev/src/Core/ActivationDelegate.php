<?php

namespace Sample\Core;
use Bamboo\Activation\ActivationManager;

/**
 * Class ActivationDelegate
 * @package Sample\Core
 *
 *          The class handling plugin activate and deactivation
 */
class ActivationDelegate implements \Bamboo\Activation\ActivationDelegate
{
    /**
     * Called when the plugin is activated. You should not do much work here. Instead, this is a place to
     * queue deferred actions that will be executed on next page refresh.
     */
    public function onActivate()
    {
        ActivationManager::scheduleDeferredAction('flushRewriteRules', 10);
    }

    /**
     * Called when the plugin is deactivated
     */
    public function onDeactivate()
    {
    }
}