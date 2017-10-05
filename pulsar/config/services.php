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

use Phalcon\Config;



use Phalcon\Mvc\Model\MetaData\Memory as MemoryMetaData;
use Phalcon\Mvc\Url                   as UrlProvider;
use Phalcon\Flash\Session             as FlashSession;
use Phalcon\Session\Adapter\Files     as SessionAdapter;
use Phalcon\Mvc\Model\Manager         as ModelsManager;
use Phalcon\Di                        as DependencyInjector;

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
		$config   = $this->getConfig();
		$security = new Authorization();
		$security->setWorkFactor( $config->system->work_factor );

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
