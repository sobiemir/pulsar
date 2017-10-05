<?php
/*
 *  This file is part of Pulsar CMS
 *  Copyright (c) by sobiemir <sobiemir@aculo.pl>
 *     ___       __            
 *    / _ \__ __/ /__ ___ _____
 *   / ___/ // / (_-</ _ `/ __/
 *  /_/   \_,_/_/___/\_,_/_/
 *
 *  This source file is subject to the New BSD License that is bundled
 *  with this package in the file LICENSE.txt.
 *
 *  You should have received a copy of the New BSD License along with
 *  this program. If not, see <http://www.licenses.aculo.pl/>.
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
