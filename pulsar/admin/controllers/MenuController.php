<?php
namespace Pulsar\Admin;
/*
 *  This file is part of Pulsar CMS
 *  Copyright (c) by sobiemir <sobiemir@aculo.pl>
 *     ___       __            
 *    / _ \__ __/ /__ ___ _____
 *   / ___/ // / (_-</ _ `/ __/
 *  /_/   \_,_/_/___/\_,_/_/
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

use Phalcon\Db\Column;
use Phalcon\Mvc\{Controller, Model\Resultset};
use Pulsar\Model\Menu;
use Pulsar\Helper\Utils;

class MenuController extends Controller
{
	public function indexAction(): void
	{
		$data = Menu::find();

		$this->view->setVars([
			'data'       => $data,
			'title'      => 'Pulsar :: Menu',
			'breadcrumb' => [
				[
					'name' => 'Treść',
					'url'  => '/admin/content'
				], [
					'name' => 'Menu',
					'url'  => '/admin/menu'
				]
			],
			'hasSidebar' => true,
			'topButtons' => [
				[
					'name'  => 'Nowe menu',
					'title' => 'Nowe menu',
					'url'   => '/admin/menu/new',
					'id'    => 'menu-create-button',
					'class' => 'fa fa-plus'
				]
			],
			'pageAccess' => [
				'admin'     => true,
				'moderator' => true,
				'editor'    => false,
				'user'      => false
			],
			'showColumn' => [
				'order'         => true,
				'id'            => true,
				'name'          => false,
				'online'        => true,
				'action-clone'  => false,
				'action-edit'   => true,
				'action-remove' => true
			]
		]);
	}

	public function newAction(): void
	{
		if( $this->postRedirect('new') )
			return;

		$data = Menu::findTranslated([
			'code'      => $this->translations->menu->name,
			'language'  => $this->config->cms->language,
			'hydration' => Resultset::HYDRATE_ARRAYS
		]);

		$this->view->setVars([
			'title'      => 'Pulsar :: Nowe menu',
			'breadcrumb' => [
				[
					'name' => 'Treść',
					'url'  => '/admin/content'
				], [
					'name' => 'Menu',
					'url'  => '/admin/menu'
				], [
					'name' => 'Nowe',
					'url'  => '/admin/menu/new'
				]
			],
			'hasSidebar' => false,
			'topButtons' => [
				[
					'name'  => 'Powrót',
					'url'   => '/admin/menu',
					'id'    => 'menu-back-button',
					'class' => 'fa fa-chevron-left'
				]
			]
		]);
	}

	public function editAction( string $id = null ): void
	{
		if( $this->postRedirect('edit', [$id]) )
			return;

		$bin = Utils::GUIDToBin( $id );

		// Languages::SetLanguage( $this->config->cms->language );

		// $lang  = Languages::GetCurrent();
		// $langs = Languages::GetAll();

		// nazwa wyświetlana w zakładkach
		// foreach( $langs as &$single )
			// $single['__display__'] = $single['default_name'];

		$data = Menu::find([
			'conditions' => [[
				'id = :id:',
				[ 'id' => $bin ],
				[ 'id' => \PDO::PARAM_STR ]
			]]
		]);

		// sprawdź czy menu istnieje
		// $data = Menu::findTranslated([
		// 	'code'       => $this->translations->menu->name,
		// 	'limit'      => 1,
		// 	'conditions' => [[
		// 		'id = :id:',
		// 		[ 'id' => $id ],
		// 		[ 'id' => \PDO::PARAM_INT ]
		// 	]],
		// ])->toArray();

		// menu o podanym indeksie nie istnieje!
		if( count($data) == 0 )
			throw new \Exception( 'Podany rekord nie istnieje!' );

		$this->view->setVars([
			// 'Languages' => $langs,
			// 'Language'  => $lang,

			'title'      => 'Pulsar :: Edycja menu',
			'breadcrumb' => [
				[
					'name' => 'Treść',
					'url'  => '/admin/content'
				], [
					'name' => 'Menu',
					'url'  => '/admin/menu'
				], [
					'name' => 'Edycja',
					'url'  => '/admin/menu/edit/' . $id
				]
			],
			'data'       => $data[0],
			'hasSidebar' => false,
			'topButtons' => [
				[
					'name'  => 'Powrót',
					'url'   => '/admin/menu',
					'id'    => 'menu-back-button',
					'class' => 'fa fa-chevron-left'
				]
			]
		]);
	}

	private function postRedirect( string $action, ?array $args = null ): bool
	{
		if( !$this->request->isPost() )
			return false;

		if( $action === 'new' )
			$this->addMenu();

		return true;
	}

	private function addMenu(): void
	{
		$menu = new Menu();
	}

	private function splitLanguages( string $data, string $idsep, string $langsep ): array
	{
		$langs   = explode( $langsep, $data );
		$content = [];

		// rozdziel tłumaczenia
		if( count($langs) > 0 )
			foreach( $langs as $lang )
			{
				if( $lang == '' )
					continue;

				// rozdziel treść od identyfikatora
				$expl = explode( $idsep, $lang );
				if( count($expl) != 2 )
					continue;

				// usuń przecinek gdy jest przed identyfikatorem
				if( $expl[0][0] == ',' )
					$expl[0] = substr( $expl[0], 1 );

				// przypisz wartość
				$content[$expl[0]] = $expl[1];
			}

		// przypisz wartość dla głównego języka
		// indeks ten w ogóle nie będzie brany pod uwagę podczas zapisu
		if( count($content) > 0 )
			if( isset($content[$this->config->cms->language]) )
				$content[0] = $content[$this->config->cms->language];
			else
				$content[0] = current( $content );

		return $content;
	}
}
