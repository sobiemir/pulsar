<?php
declare(strict_types=1);

// define environment for application
// there are 3 predefined environments (PROD / RC / DEV)
// you should add it to the ENVIRONMENT variables in your server
$env_value = (string)getenv('PULSAR_ENVIRONMENT');
define('PULSAR_ENVIRONMENT', $env_value ?? 'DEV');

require __DIR__ . '/../vendor/autoload.php';
