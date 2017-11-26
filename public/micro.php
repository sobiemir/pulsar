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

use Phalcon\Mvc\Micro;
use Phalcon\Loader;
use Phalcon\Mvc\Router;
use Phalcon\Di as DependencyInjector;
use Phalcon\Http\Request;

// raportowanie błędów
ini_set( 'display_errors', true );
error_reporting( E_ALL );

define( 'BASE_PATH', dirname(__DIR__) . '/' );
define( 'APP_PATH', BASE_PATH . 'pulsar/' );

$loader = new Loader();
$loader->registerNamespaces([
	'Pulsar\\Micro'   => APP_PATH . 'micro/',
	'Pulsar\\Model'   => APP_PATH . 'models/',
	'Pulsar\\Service' => APP_PATH . 'services/'
]);
$loader->register();

$di = new DependencyInjector();

$di->setShared( 'response', function()
{
	$response = new \Phalcon\Http\Response();
	$response->setContentType('application/json', 'utf-8');

	return $response;
} );
$di->setShared( 'mimes', function()
{
	return require_once APP_PATH . 'config/mimes.php';
} );
$di->set( 'router', function()
{
	return new Router( false );
} );
$di->set( 'request', function()
{
	return new Request();
} );

$app = new Micro();
$app->setDI( $di );

$router = new Router( false );

$routes = require_once APP_PATH . 'config/micro.php';
foreach( $routes as $route )
	$app->mount( $route );

$app->handle();
