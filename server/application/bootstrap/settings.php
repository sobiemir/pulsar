<?php
declare(strict_types=1);

use DI\ContainerBuilder;

return function (ContainerBuilder $builder) {
    $main_config = json_decode(file_get_contents('../environment/settings.json'));
    $additional_config = json_decode(file_get_contents('../environment/settings.' . PULSAR_ENVIRONMENT . '.json'));

    $builder->addDefinitions([
        'settings' => array_merge($main_config, $additional_config)
    ]);
};
