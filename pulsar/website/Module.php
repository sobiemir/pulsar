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

namespace Pulsar\Website;

use Phalcon\DiInterface;

/**
 * Flaga braku akcji używana w modelach.
 *
 * TYPE: integer
 */
define( 'ZMFLAG_NONE', 0 );

/**
 * Flaga zapisu używana w modelach.
 *
 * TYPE: integer
 */
define( 'ZMFLAG_SAVE', 1 );

class Module implements \Phalcon\Mvc\ModuleDefinitionInterface
{
	public function registerAutoloaders( DiInterface $di = null )
	{
		$loader = new \Phalcon\Loader();
		$loader->registerNamespaces([
			'Pulsar\\Website'    => APP_PATH . 'website/controllers/',
			'Pulsar\\Model'      => APP_PATH . 'models/',
			'Pulsar\\Library'    => APP_PATH . 'libraries/',
			'Pulsar\\Helper'     => APP_PATH . 'helpers/',
			'Pulsar\\Interfaces' => APP_PATH . 'interfaces/'
		]);
		$loader->register();
	}

	public function registerServices( DiInterface $di )
	{
		$di->set( "dispatcher",
			function() {
				$dispatcher = new \Phalcon\Mvc\Dispatcher();
				$dispatcher->setDefaultNamespace( 'Pulsar\\Website' );
				return $dispatcher;
			}
		);

		$di->set( "view", function() use ($di) {
			$view = new \Phalcon\Mvc\View();
			return $view;
		} );
	}
}
