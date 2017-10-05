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
