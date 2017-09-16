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

use Phalcon\Mvc\Router;

$router = new Router( false );

// przekierowania na stronę
$router->add(
	'/', [
		'module'     => 'website',
		'controller' => 'index',
		'action'     => 'index'
	]
);
$router->add(
	'/:controller(/?)', [
		'module'     => 'website',
		'controller' => 1,
		'action'     => 'index'
	]
);
$router->add(
	'/:controller/:action/:params', [
		'module'     => 'website',
		'controller' => 1,
		'action'     => 2,
		'params'     => 3
	]
);

// przekierowania na instalację
$router->add(
	'/install/:controller/:action/:params', [
		'module'     => 'install',
		'controller' => 1,
		'action'     => 2,
		'params'     => 3
	]
);
$router->add(
	'/install/:controller(/?)', [
		'module'     => 'install',
		'controller' => 1,
		'action'     => 'index'
	]
);
$router->add(
	'/install(/?)', [
		'module'     => 'install',
		'controller' => 'index',
		'action'     => 'index'
	]
);

// przekierowania na panel administratora
$router->add(
	'/admin/:controller/:action/:params', [
		'module'     => 'admin',
		'controller' => 1,
		'action'     => 2,
		'params'     => 3
	]
);
$router->add(
	'/admin/:controller(/?)', [
		'module'     => 'admin',
		'controller' => 1,
		'action'     => 'index'
	]
);
$router->add(
	'/admin(/?)', [
		'module'     => 'admin',
		'controller' => 'index',
		'action'     => 'index'
	]
);
$router->add(
	'/admin/login', [
		'module'     => 'admin',
		'controller' => 'index',
		'action'     => 'login'
	]
);


return $router;
