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

return
[
	'system' =>
	[
		'maintenance' => 0,
		'work_factor' => 10
	],
	'database' =>
	[
		'adapter'    => 'MySQL',
		'host'       => 'localhost',
		'username'   => 'root',
		'password'   => '',
		'dbname'     => 'pluto',
		'port'       => 3306,
		'persistent' => 1,
		'charset'    => 'utf8',
		'prefix'     => ''
	],
	'cms' =>
	[
		'dynamic_version' => false,
		'language'        => '9e76c39b-fb16-474d-b4aa-cf4c1ff7d441'
	]
];
