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

namespace Pulsar\Admin;

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
			'Pulsar\\Admin'      => APP_PATH . 'admin/controllers/',
			'Pulsar\\Model'      => APP_PATH . 'models/',
			'Pulsar\\Library'    => APP_PATH . 'libraries/',
			'Pulsar\\Helper'     => APP_PATH . 'helpers/',
			'Pulsar\\Interface'  => APP_PATH . 'interfaces/',
			'Pulsar\\Service'    => APP_PATH . 'services/'
		]);
		$loader->register();
	}

	public function registerServices( DiInterface $di )
	{
		$di->set( "dispatcher",
			function() {
				$dispatcher = new \Phalcon\Mvc\Dispatcher();
				$dispatcher->setDefaultNamespace( 'Pulsar\\Admin' );
				return $dispatcher;
			}
		);

		$di->set( "view", function() use ($di) {
			$config = $this->getConfig();
			$view   = new \Phalcon\Mvc\View();
			$theme  = $config->admin->theme;

			$view->setViewsDir( APP_PATH . 'admin/views/' . $theme . '/' );

			// wersja dynamiczna lub statyczna
			if( $config->cms->dynamic_version )
				$view->setMainView(
					APP_PATH . 'admin/views/' . $theme . '/dynamic'
				);
			else
				$view->setMainView(
					APP_PATH . 'admin/views/' . $theme . '/main'
				);

			// silniki renderowania - vhtm i phtm
			$volt = new \Phalcon\Mvc\View\Engine\Volt( $view, $di );
			$volt->setOptions([
				// rozszerzenie przekompilowanego szablonu
				'compiledExtension' => '.php',
				// ścieżka do przechowywania szablonów w php
				'compiledPath' => APP_PATH . 'cache/',
				// sprawdza czy istnieją różnice pomiędzy szablonami
				'stat' => true,
				// czy szablony mają być kompilowane za każdym razem?
				'compileAlways' => true,
				// separator zastępujący / w oddzielaniu folderów
				'compiledSeparator' => '_',
			]);
			$view->registerEngines([
				'.volt' => $volt,
				'.phtm' => \Phalcon\Mvc\View\Engine\Php::class
			]);
			return $view;
		} );
	}
}
