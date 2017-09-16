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

namespace Pulsar\Admin;

use Phalcon\DiInterface;

class Module implements \Phalcon\Mvc\ModuleDefinitionInterface
{
	public function registerAutoloaders( DiInterface $di = null )
	{
		$loader = new \Phalcon\Loader();
		$loader->registerNamespaces([
			'Pulsar\\Admin'   => APP_PATH . 'admin/controllers/',
			'Pulsar\\Model'   => APP_PATH . 'models/',
			'Pulsar\\Library' => APP_PATH . 'libraries/',
			'Pulsar\\Helper'  => APP_PATH . 'helpers/'
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

			$view->setViewsDir( APP_PATH . 'admin/views/pluto/' );

			// wersja dynamiczna lub statyczna
			if( $config->cms->dynamic_version )
				$view->setMainView( APP_PATH . 'admin/views/pluto/dynamic' );
			else
				$view->setMainView( APP_PATH . 'admin/views/pluto/main' );

			// silniki renderowania - vhtm i phtm
			$volt = new \Phalcon\Mvc\View\Engine\Volt( $view, $di );
			$volt->setOptions([
				'compiledExtension' => '.php',                   // rozszerzenie przekompilowanego szablonu
				'compiledPath'      => APP_PATH . 'cache/',      // ścieżka do przechowywania przekompilowanych szablonów
				'stat'              => true,                     // sprawdza czy istnieją różnice pomiędzy szablonami
				'compileAlways'     => true,                     // czy szablony mają być kompilowane za każdym razem?
				'compiledSeparator' => '_',                      // separator zastępujący / w oddzielaniu folderów
			]);
			$volt->getCompiler()->addFunction(
				'bin2guid', function($guid) {
					return "\\Pulsar\\Helper\\Utils::BinToGUID({$guid})";
				}
			);
			$view->registerEngines([
				'.volt' => $volt,
				'.phtm' => \Phalcon\Mvc\View\Engine\Php::class
			]);
			return $view;
		} );
	}
}
