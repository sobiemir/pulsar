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
	private $_fm = null;

	/**
	 * Konstruktor klasy FilemanagerController.
	 */
	public function __construct()
	{
		$this->_fm = new FilemanagerService( $this->di );
	}

	public function directoriesAction(): string
	{
		$rec = (int)$this->request->getPost( 'recursive', null, 0 );

		$path = $this->_fm->getRealPath(
			$this->request->getPost( 'path', null, '/' )
		);
		return json_encode(
			$this->_fm->listDirectories( $path, $rec != 0 )
		);
	}

	public function entitiesAction(): string
	{
		$path = $this->_fm->getRealPath(
			$this->request->getPost( 'path', null, '/' )
		);
		return json_encode(
			$this->_fm->listEntities( $path )
		);
	}

	public function fileAction( string $path = "/" ): bool
	{
		$path = $this->_fm->getRealPath( $path );

		if( !is_file($path) )
			return false;

		$mime = $this->_fm->getMimeType( $path, false );

		if( $mime != '' )
			header( 'Content-Type: ' . $mime );
		header( 'Content-Disposition: filename=' . basename($path) );

		if( $mime != 'image/png' && $mime != 'image/jpeg' &&
			$mime != 'image/gif' && filesize($path) > 4096 )
		{
			header( 'Content-Length: 4096' );

			$handle = fopen( $path, "rb" );
    		echo fread( $handle, 4096 );
    		fclose( $handle );

			return true;
		}
		header( 'Content-Length: ' . filesize($path) );

		readfile( $path );
		return true;
	}
}
