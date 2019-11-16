<?php
declare(strict_types=1);

use DI\ContainerBuilder;

return function (ContainerBuilder $builder) {
    $database = require_once __DIR__ . '../settings/database.php';

    $builder->addDefinitions([
        'settings' => [
            'database' => $database
        ]
    ]);
};
