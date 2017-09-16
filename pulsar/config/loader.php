<?php
/*
 *  This file is part of Pulsar CMS
 *  Copyright (c) by sobiemir <sobiemir@aculo.pl>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

use Phalcon\Loader;

// $loader = new Loader();

// $loader->registerDirs([
// 	APP_PATH . 'libraries',
// 	APP_PATH . 'helpers',
// 	APP_PATH . 'models'
// ]);

// moduły
$application->registerModules([
	'admin' => [
		'className' => '\\Pulsar\\Admin\\Module',
		'path'      => APP_PATH . 'admin/Module.php'
	],
	'install' => [
		'className' => '\\Pulsar\\Install\\Module',
		'path'      => APP_PATH . 'install/Module.php'
	],
	'website' => [
		'className' => '\\Pulsar\\Website\\Module',
		'path'      => APP_PATH . 'website/Module.php'
	]
]);

// $loader->register();
