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

/*
 *  This is standard configuration file.
 *  Changes here are permitted (may be overwritten by new version of system).
 *  All options placed here are overwritten by data from "config.php" file.
 *  This is only template for configuration file, that fullfill missing options.
 *  Configuration for change is placed in "config.json" file.
 */
return [
	'system' => [
		'maintenance' => 0,
		'work_factor' => 10
	],
	'database' => [
		'dialect' => 'mysql',
		'host' => '127.0.0.1',
		'username' => 'root',
		'password' => '',
		'database' => 'pluto',
		'port' => 3306,
		'persistent' => 1,
		'charset' => 'utf8',
		'prefix' => '',
		'migrationStorage' => 'sequelize',
		'migrationStorageTableName' => 'sequelize_meta',
		'seederStorage' => 'sequelize',
		'seederStorageTableName' => 'sequelize_seed',
		'logging' => false,
		'benchmark' => false
	],
	'admin' => [
		'theme'    => 'pluto',
		'language' => 1
	],
	'cms' => [
		'dynamic_version' => false,
		'language'        => 1
	]
];
