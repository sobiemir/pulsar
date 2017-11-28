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
		$rec  = (int)$this->request->getPost( 'recursive', null, 0 );
		$path = $this->request->getPost( 'path', null, '/' );
		$path = trim( $this->_fm->getRealPath($path) );

		return json_encode(
			$this->_fm->listDirectories( $path, $rec != 0 )
		);
	}

	public function entitiesAction(): string
	{
		$path = $this->request->getPost( 'path', null, '/' );
		$path = trim( $this->_fm->getRealPath($path) );

		return json_encode(
			$this->_fm->listEntities( $path )
		);
	}

	public function createDirectoryAction(): string
	{
		$path = $this->request->getPost( 'path', null, '/' );
		$path = trim( $this->_fm->getRealPath($path) );

		return json_encode(
			$this->_fm->createDirectory( $path )
		);
	}

	public function uploadAction(): string
	{
		// sprawdź czy żądanie zawiera pliki
		if( !$this->request->hasFiles() )
			return json_encode( [
				'status'   => '406',
				'message'  => 'Not Acceptable',
				'response' => 'Cannot upload data without files'
			] );

		// pobierz pliki do wgrania i folder
		$path  = $this->request->getPost( 'path', null, '/' );
		$files = $this->request->getUploadedFiles();

		foreach( $files as $file )
		{
			// pobierz ścieżkę do pliku gdzie ma być wgrany
			$path = $this->_fm->getRealPath( $path . '/' . $file->getName() );

			// nie wgrywaj pliku o takiej samej nazwie
			if( is_file($path) )
				continue;

			// zapisz plik
			$file->moveTo( $path );
		}

		return json_encode( [
			'status'  => '200',
			'message' => 'OK'
		] );
	}

	public function downloadAction( string $path = "/" ): void
	{
		// pobierz ścieżkę do pliku
		$path = trim( $this->_fm->getRealPath($path) );

		// tylko plik może być pobrany
		if( !is_file($path) )
			return;

		// pobierz typ mime
		$mime = $this->_fm->getMimeType( $path );
		$file = basename( $path );

		// ustaw nagłówki
		header( 'Content-Description: File Transfer' );
		header( 'Content-Type: ' . $mime );
		header( 'Content-Disposition: attachment; filename="' . $file . '"' );
		header( 'Expires: 0' );
		header( 'Cache-Control: must-revalidate' );
		header( 'Pragma: public' );
		header( 'Content-Length:' . filesize($path) );

		// jeżeli plik zajmuje więcej niż 1mb, pobieraj go częściami
		if( filesize($path) > 1048576 )
		{
			$handle = fopen( $path, "rb" );

			// po 8 kb
			while( !feof($handle) )
				echo fread( $handle, 8192 );

			fclose( $handle );
			return;
		}

		// jeżeli nie, pobierz cały
		readfile( $path );
	}

	public function previewAction( string $path = "/" ): void
	{
		// pobierz ścieżkę do pliku
		$path = trim( $this->_fm->getRealPath($path) );

		// jeżeli nie jest to plik, przerwij dalsze działanie
		if( !is_file($path) )
			return;

		// pobierz typ mime
		$mime = $this->_fm->getMimeType( $path, false );

		// jeżeli typ mime został wykryty, ustaw go
		if( $mime != '' )
			header( 'Content-Type: ' . $mime );
		header( 'Content-Disposition: filename="' . basename($path) . '"' );

		// dla plików innych niż obrazy, przycinaj treść do 8kb
		if( $mime != 'image/png' && $mime != 'image/jpeg' &&
			$mime != 'image/gif' && filesize($path) > 8192 )
		{
			header( 'Content-Length: 8192' );

			$handle = fopen( $path, "rb" );
    		echo fread( $handle, 8192 );
    		fclose( $handle );

    		return;
		}
		header( 'Content-Length: ' . filesize($path) );

		// wczytaj plik
		readfile( $path );
	}
}
