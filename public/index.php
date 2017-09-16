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
