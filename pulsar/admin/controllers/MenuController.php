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

use Phalcon\Http\Response;
use Pulsar\Model\{Menu, Language};
use Pulsar\Helper\{TabElement, BaseController};

/**
 * Klasa kontrolera dla menu aplikacji.
 *
 * DESCRIPTION:
 *     Klasa zawiera akcje do których można dostać się przez przeglądarkę.
 *     Pozwala na tworzenie, edycję, wyświetlanie i usuwanie menu.
 *     Operacje dodawania i edycji i po części usuwania realizowane są przy
 *     użyciu jednej funkcji.
 */
class MenuController extends BaseController
{
	/**
	 * Flaga edycji menu.
	 *
	 * DESCRIPTION:
	 *     W przypadku gdy użytkownik tworzy nowe menu, flaga ustawiona jest
	 *     na wartość FALSE.
	 *     Proces edycji i dodawania menu korzysta z tej samej funkcji, dlatego
	 *     ta flaga pozwala zadecydować o tym co wyświetlić lub jaką akcję
	 *     wykonać podczas zapisywania danych.
	 * 
	 * TYPE: boolean
	 */
	private $_editing = true;

// =============================================================================

	public function indexAction(): void
	{
		// przełącznik pomiędzy elementami przetłumaczonymi a do tłumaczenia
		$switch = [
			new TabElement( 1, 'Przetłumaczone' ),
			new TabElement( 2, 'Do tłumaczenia' )
		];

		// pobierz wszystkie dostępne języki
		$all = Language::getAll();

		$data = [
			// przetłumaczone elementy, limit 30, sortowanie po 'order'
			Menu::find([
				'conditions' => [[
					'id_language = :lang:',
					[ 'lang' => $this->config->cms->language ],
					[ 'lang' => \PDO::PARAM_INT ]
				]],
				'order' => '[order]',
				'limit' => 30
			]),
			Menu::findUntranslated([
				'language'  => $this->config->cms->language,
				'limit'     => 30,
				'languages' => $all
			])
		];

		$this->view->setVars( array_merge($this->_vars, [
			'data'       => $data,
			'languages'  => $all,
			'switch'     => $switch,
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
				'index'   => true,
				'id'      => false,
				'name'    => true,
				'online'  => true,
				'private' => true
			],
			'showAction' => [
				'clone'  => false,
				'edit'   => true,
				'remove' => true
			]
		]) );
	}

	public function newAction()
	{
		$this->_editing = false;

		$this->dispatcher->forward([
			'action' => 'edit',
			'params' => [ null ]
		]);
	}

	public function editAction( int $id = null )
	{
		Language::setLanguage( $this->config->cms->language );

		$all = Language::getFrontend();
		$cur = Language::getCurrent();

		$data    = [];
		$avlangs = [];

		// zapisz identyfikatory znanych języków
		foreach( $all as $lang )
			$avlangs[$lang->id] = $lang->id;

		// wyszukaj menu do edycji (wszystkie języki)
		if( $this->_editing )
		{
			$menus = Menu::find([
				'conditions' => [[
					'id = :id:',
					[ 'id' => $id ],
					[ 'id' => \PDO::PARAM_INT ]
				]]
			]);
			if( count($menus) == 0 )
				throw new \Exception( 'Podany rekord nie istnieje!' );

			// odrzuć nieużywane języki
			foreach( $menus as $menu )
				if( isset($avlangs[$menu->id_language]) )
				{
					$data[] = $menu;
					unset( $avlangs[$menu->id_language] );
				}
		}

		// uzupełnij pustymi danymi brakujące języki
		foreach( $avlangs as $langid )
			$data[] = (new Menu([
				'id'          => $id,
				'id_language' => $langid
			]))->setFlag( ZMFLAG_NONE );

		// edycja lub dodawanie nowego elementu
		if( $this->request->isPost() )
			return $this->editMenu( $data );

		$this->view->setVars( array_merge($this->_vars, [
			'languages'    => $all,
			'language'     => $cur,
			'isEditing'    => $this->_editing,
			'data'         => $data,
			'hasSidebar'   => false,
			'removeAction' => '/admin/menu/remove/' . $id,
			'saveAction'   => $this->_editing
				? '/admin/menu/edit/' . $id
				: '/admin/menu/new/',
			'title' => $this->_editing
				? 'Pulsar :: Edycja menu'
				: 'Pulsar :: Nowe menu',
			'breadcrumb' => [
				[
					'name' => 'Treść',
					'url'  => '/admin/content'
				], [
					'name' => 'Menu',
					'url'  => '/admin/menu'
				], [
					'name' => $this->_editing
						? 'Edycja'
						: 'Nowe',
					'url'  => $this->_editing
						? '/admin/menu/edit/' . $id
						: '/admin/menu/new'
				]
			],
			'topButtons'   => [
				[
					'name'  => 'Powrót',
					'url'   => '/admin/menu',
					'id'    => 'menu-back-button',
					'class' => 'fa fa-chevron-left'
				]
			]
		]) );
	}

	public function removeAction( int $id ): ?Response
	{
		$menus = Menu::find([
			'conditions' => [[
				'id = :id:',
				[ 'id' => $id ],
				[ 'id' => \PDO::PARAM_INT ]
			]]
		]);

		foreach( $menus as $menu )
			$menu->delete();

		return $this->response->redirect( 'admin/menu' );
	}

// =============================================================================

	private function editMenu( array $data ): ?Response
	{
		$groupid = null;
		$post    = $this->request->getPost();

		// pobierz identyfikator z pierwszego elementu
		if( count($data) > 0 )
			$groupid = reset($data)->id;

		// przechodź po wszystkich elementach menu
		foreach( $data as $single )
		{
			$variant = $single->getVariant();
			$flag    = (int)$post['flag:' . $variant] ?? 0;
			$save    = [
				'name'    => $post['name:' . $variant] ?? '',
				'private' => (int)(($post['private:' . $variant] ?? '') != ''),
				'online'  => (int)(($post['online:' . $variant] ?? '') != '')
			];

			// jeżeli flaga zapisu została usunięta, usuń
			if( $flag == ZMFLAG_NONE && $single->getFlag() == ZMFLAG_SAVE )
			{
				$single->delete();
				continue;
			}

			// pomiń jeżeli dane są takie same
			if( !$single->hasDifference($save) )
				continue;

			// pomiń również jeżeli model nie istnieje i nie będzie tworzony
			if( $flag == ZMFLAG_NONE && $single->getFlag() == ZMFLAG_NONE )
				continue;

			$single->name    = $save['name'];
			$single->private = $save['private'];
			$single->online  = $save['online'];

			// korekta identyfikatora
			if( !$this->_editing )
				$single->id = $groupid;

			// utwórz nowy element gdy nie istniał
			if( $single->getFlag() == ZMFLAG_NONE )
			{
				// pobierz rekord z największą wartością pola 'order'
				$last = Menu::findFirst([
					'conditions' => [[
						'id_language = :lang:',
						[ 'lang' => $single->id_language ],
						[ 'lang' => \PDO::PARAM_INT ]
					]],
					'for_update' => true,
					'order'      => '[order] DESC'
				]);

				// jeżeli nie znaleziono żadnego, ustaw 1
				if( $last == null )
					$single->order = 1;
				// jeżeli znaleziono, zwiększ go o 1
				else
					$single->order = $last->order + 1;

				// zapisz
				$single->create();
			}
			else
				$single->update();

			// pobierz identyfikator grupy po zapisaniu pierwszego elementu
			if( !$this->_editing && $groupid == null )
				$groupid = $single->id;
		}
		return $this->response->redirect( 'admin/menu' );
	}
}
