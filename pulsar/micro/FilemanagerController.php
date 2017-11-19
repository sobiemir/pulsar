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

namespace Pulsar\Micro;

use Phalcon\Http\Response;
use Phalcon\DI\Injectable;
use Pulsar\Service\FilemanagerService;

class FilemanagerController extends Injectable
{
	/**
	 * Klasa główna menedżera plików.
	 *
	 * TYPE: FilemanagerService
	 */
	private $sfmgr = null;

	/**
	 * Konstruktor klasy FilemanagerController.
	 */
	public function __construct()
	{
		$this->sfmgr = new FilemanagerService();
	}

	/**
	 * Akcja wywoływana podczas dostępu do listy katalogów w folderze.
	 *
	 * PARAMETERS:
	 *     $rec: integer
	 *         Czy program ma szukać również podfolderów?
	 *     $path: string
	 *         Ścieżka do folderu z którego pobierane będą katalogi.
	 * RETURNS: string
	 *     Zakodowaną do formatu JSON listę folderów w podanym katalogu.
	 */
	public function directoriesAction( bool $rec = false, string $path = '/' )
		: string
	{
		$path = $this->sfmgr->getRealPath( $path );
		return json_encode(
			$this->sfmgr->listDirectories( $path, $rec != 0 )
		);
	}

	/**
	 * Akcja wywoływana podczas dostępu do listy obiektów w folderze.
	 *
	 * PARAMETERS:
	 *     $path: string
	 *         Ścieżka do folderu z którego pobierane będą obiekty.
	 * RETURNS: string
	 *     Zakodowaną do formatu JSON listę obiektów w podanym folderze.
	 */
	public function entitiesAction( string $path = '/' )
		: string
	{
		$path = $this->sfmgr->getRealPath( $path );
		return json_encode(
			$this->sfmgr->listEntities( $path, $recursive != 0 )
		);
	}
}
