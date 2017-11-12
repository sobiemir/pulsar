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

namespace Pulsar\Helper;

use Phalcon\Mvc\Controller;
use Phalcon\Mvc\Model\Resultset;
use Pulsar\Model\{Menu, Language};

class BaseController extends Controller
{
	protected $_menus = [];
	protected $_vars  = [];

	public function initialize(): void
	{
		// pobierz wszystkie dostępne języki
		$all = Language::getAll();

		// przetłumaczone elementy, limit 30, sortowanie po 'order'
		$this->_menus = Menu::find([
			'conditions' => [[
				'id_language = :lang:',
				[ 'lang' => $this->config->cms->language ],
				[ 'lang' => \PDO::PARAM_INT ]
			]],
			'order' => '[order]'
		]);

		// ustaw standardowe wartości zmiennych przekazywanych do szablonów
		$this->_vars = [
			'menus' => $this->_menus
		];
	}

	public function beforeExecuteRoute( $dispatcher ): bool
	{
		return true;
	}
}
