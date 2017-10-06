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
use Phalcon\Mvc\Application;

// raportowanie błędów
ini_set( 'display_errors', true );
error_reporting( E_ALL );

define( 'BASE_PATH', dirname(__DIR__) . '/' );
define( 'APP_PATH', BASE_PATH . 'pulsar/' );

try
{
	$di = require_once APP_PATH . 'config/services.php';
	$application = new Application($di);

	require_once APP_PATH . 'config/loader.php';
	$response = $application->handle();
	$response->send();
}
catch( Exception $ex )
{
	echo '<h1>Pulsar</h1>';
	echo $ex->getMessage() . '<br>';
	echo nl2br(htmlentities($ex->getTraceAsString()));
}
