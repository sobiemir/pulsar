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
