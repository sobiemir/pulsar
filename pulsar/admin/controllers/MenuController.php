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
	public function indexAction(): void
	{
		// przełącznik pomiędzy elementami przetłumaczonymi a do tłumaczenia
		$switch = [
			new ControlElement( 1, 'Przetłumaczone' ),
			new ControlElement( 2, 'Do tłumaczenia' )
		];

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
			// nieprzetłumaczone elementy, limit 30, brak sortowania
			// sortowanie jest wyłączone z racji tego, iż każdy język może mieć
			// różne sortowanie elementów
			Menu::find([
				'group'  => 'id',
				'having' => "id_language != :lang:",
				'bind'   => [
					'lang' => $this->config->cms->language
				],
				'bindTypes' => [
					'lang' => \PDO::PARAM_STR
				],
				'limit' => 30
			])
		];

		$this->view->setVars([
			'data'       => $data,
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

	public function newAction()
	{
		if( $this->postRedirect('new') )
		{
			$response = new Response();
			return $response->redirect( "admin/menu" );
		}

		Language::setLanguage( $this->config->cms->language );
		
		// pobierz listę języków
		$all = Language::getFrontend();
		$cur = Language::getCurrent();

		// wygeneruj nowy identyfikator dla menu
		$data = [];
		$id   = Utils::GenerateBinGUID();

		// utwórz puste menu dla każdego z dostępnych języków
		foreach( $all as $lang )
			$data[] = new Menu([
				'id'          => $id,
				'id_language' => $lang->id
			]);

		// ustaw zmienne dla widoku
		$this->view->setVars([
			'languages'  => $all,
			'language'   => $cur,
			'data'       => $data,
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

	public function editAction( string $id = null )
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
		if( count($menus) == 0 )
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
			]))->setFlag( ZMFLAG_CLEAN );

		foreach( $data as $single )
			var_dump($single->getFlag());
		$this->view->disable();

		// edycja 
		if( $this->request->isPost() )
			return $this->editMenu( $id, $data );

		$this->view->setVars([
			'languages' => $all,
			'language'  => $cur,

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

	private function editMenu( $id, $data ): Response
	{
		$response = new Response();

		$all  = Language::getFrontend();
		$post = $this->request->getPost();

		foreach( $data as $single )
		{
			$change  = false;
			$name    = $post['name:'    . $single->getVariant()] ?? '';
			$private = ($post['private:' . $single->getVariant()] ?? '') != '';
			$online  = ($post['online:'  . $single->getVariant()] ?? '') != '';

			if( $name   != $single->name || $private != $single->private ||
				$online != $single->online )
				$change = true;

			if( $change )
			{
				$single->name    = $name;
				$single->private = $private;
				$single->online  = $online;
			}
		}

		return $response->redirect( 'admin/menu' );
	}

	private function addMenu(): void
	{
		$menu = new Menu();
	}
}
