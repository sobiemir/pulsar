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
 *  This source file is subject to the New BSD License that is bundled
 *  with this package in the file LICENSE.txt.
 *
 *  You should have received a copy of the New BSD License along with
 *  this program. If not, see <http://www.licenses.aculo.pl/>.
 */

use Phalcon\Db\Column;
use Phalcon\Mvc\{Controller, Model\Resultset};
use Phalcon\Http\Response;
use Pulsar\Model\{Menu, Language};
use Pulsar\Helper\{Utils, ControlElement};

class MenuController extends Controller
{
	private $_editing = true;

	public function indexAction(): void
	{
		// przełącznik pomiędzy elementami przetłumaczonymi a do tłumaczenia
		$switch = [
			new ControlElement( 1, 'Przetłumaczone' ),
			new ControlElement( 2, 'Do tłumaczenia' )
		];

		// pobierz wszystkie dostępne języki
		$all = Language::getAll();

		$data = [
			// przetłumaczone elementy, limit 30, sortowanie po 'order'
			Menu::find([
				'conditions' => [[
					'id_language = :lang:',
					[ 'lang' => $this->config->cms->language ],
					[ 'lang' => \PDO::PARAM_STR ]
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

		$this->view->setVars([
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
		]);
	}

	public function newAction( string $id = null )
	{
		$this->_editing = false;

		if( $id == null )
		{
			if( $this->request->isPost() )
				throw new Exception( 'Nieprawidłowe żądanie' );

			$id = Utils::GenerateGUID();
		}

		$this->dispatcher->forward([
			'action' => 'edit',
			'params' => [
				$id
			]
		]);
	}

	public function editAction( string $id )
	{
		$bin = Utils::GUIDToBin( $id );

		Language::setLanguage( $this->config->cms->language );

		$all = Language::getFrontend();
		$cur = Language::getCurrent();

		// wyszukaj menu do edycji (wszystkie języki)
		$menus = Menu::find([
			'conditions' => [[
				'id = :id:',
				[ 'id' => $bin ],
				[ 'id' => \PDO::PARAM_STR ]
			]]
		]);

		// menu o podanym indeksie nie istnieje!
		if( count($menus) == 0 && $this->_editing )
			throw new \Exception( 'Podany rekord nie istnieje!' );

		$data    = [];
		$avlangs = [];

		// zapisz identyfikatory znanych języków
		foreach( $all as $lang )
			$avlangs[$lang->id] = $lang->id;

		// odrzuć nieużywane języki
		foreach( $menus as $menu )
			if( isset($avlangs[$menu->id_language]) )
			{
				$data[] = $menu;
				unset( $avlangs[$menu->id_language] );
			}

		// uzupełnij pustymi danymi brakujące języki
		foreach( $avlangs as $langid )
			$data[] = (new Menu([
				'id'          => $bin,
				'id_language' => $langid
			]))->setFlag( ZMFLAG_NONE );

		// edycja 
		if( $this->request->isPost() )
			return $this->editMenu( $id, $data );

		$this->view->setVars([
			'languages' => $all,
			'language'  => $cur,
			'isEditing' => $this->_editing,

			'title'      => 'Pulsar :: Edycja menu',
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
			'data'       => $data,
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

	private function editMenu( $id, $data ): ?Response
	{
		$response = new Response();
		$post     = $this->request->getPost();

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

			// utwórz nowy element gdy nie istniał
			if( $single->getFlag() == ZMFLAG_NONE )
			{
				// pobierz rekord z największą wartością pola 'order'
				$last = Menu::findFirst([
					'conditions' => [[
						'id_language = :lang:',
						[ 'lang' => $single->id_language ],
						[ 'lang' => \PDO::PARAM_STR ]
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
		}
		return $response->redirect( 'admin/menu' );
	}

	private function addMenu(): void
	{
		$menu = new Menu();
	}
}
