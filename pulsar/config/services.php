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

use Phalcon\Config;



use Phalcon\Mvc\Model\MetaData\Memory as MemoryMetaData;
use Phalcon\Di                        as DependencyInjector;
use Phalcon\Mvc\Url                   as UrlProvider;
use Phalcon\Tag                       as TagManager;
use Phalcon\Flash\Session             as FlashSession;
use Phalcon\Session\Adapter\Files     as SessionAdapter;
use Phalcon\Mvc\Model\Manager         as ModelsManager;

use Phalcon\Mvc\View;
use Phalcon\Mvc\Dispatcher;
use Phalcon\Http\Response;
use Phalcon\Http\Request;
use Phalcon\Escaper;

use Pulsar\Library\Authorization;
use Pulsar\Library\AccessControl;
use Pulsar\Helper\{Tags, Utils};

$di = new DependencyInjector();

// logowanie / zabezpieczenia
$di->set(
	'security',
	function()
	{
		$security = new Authorization();
		$security->setWorkFactor( $this->config->system->work_factor );

		return $security;
	},
	true
);
// kontrola dostępu
$di->set(
	'access',
	function()
	{
		$access = new AccessControl();
		return $access;
	}
);
// konfiguracja
$di->set(
	'config',
	function()
	{
		$config = require APP_PATH . 'config/config.php';

		// zamień czytelny identyfikator na binarny ciąg
		$config['cms']['language'] = Utils::GUIDToBin(
			$config['cms']['language']
		);

		return new Config( $config );
	}
);
// tagi HTML
$di->set(
	'tag',
	function()
	{
		$tags = new Tags();
		return $tags;
	}
);

$di->set('escaper', function()
{
	return new Escaper();
});

$di->set('modelsMetadata', function()
{
	$metadata = new MemoryMetaData();
	return $metadata;
});


$di->setShared('session', function () {
	$session = new SessionAdapter();
	$session->start();

	return $session;
});

$di->set('flashSession', function()
{
	return new FlashSession([
		"error"   => "message error",
		"success" => "message success",
		"notice"  => "message notice",
		"warning" => "message warning",
	]);
});

 $di->set('modelsManager', function() {
	  return new ModelsManager();
 });


$di->set('url', function()
{
	$config = $this->getConfig();

	$url = new UrlProvider();
	$url->setBaseUri('/');
	return $url;
});

$di->set('router', function()
{
	return require_once APP_PATH . 'config/router.php';
});

$di->set('dispatcher', function()
{
	return new Dispatcher();
});

$di->set('response', function()
{
	return new Response();
});

$di->set('request', function()
{
	return new Request();
});

$di->set('db', function()
{
	$config = $this->getConfig();

	// sqlite3
	if( $config->database->adapter == 'SQLite' ) {
		return new Phalcon\Db\Adapter\Pdo\Sqlite([
			'dbname' => $config->database->database
		]);
	}
	// mysql
	else if( $config->database->adapter == 'MySQL' ) {
		return new Phalcon\Db\Adapter\Pdo\Mysql([
			'host'     => $config->database->host,
			'dbname'   => $config->database->dbname,
			'port'     => $config->database->port,
			'username' => $config->database->username,
			'password' => $config->database->password,
			'charset'  => $config->database->charset
		]);
	}
	// postgresql
	return new Phalcon\Db\Adapter\Pdo\Postgresql([
		'host'     => $config->database->host,
		'dbname'   => $config->database->dbname,
		'port'     => $config->database->port,
		'username' => $config->database->username,
		'password' => $config->database->password,
		'charset'  => $config->database->charset
	]);
});

return $di;
