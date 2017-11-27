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

namespace Pulsar\Service;

use Phalcon\DiInterface;

class FilemanagerService
{
	protected $di;

	public function __construct( DiInterface $di )
	{
		$this->di = $di;
	}

	/**
	 * https://github.com/thephpleague/flysystem/blob/master/src/Util.php
	 */
	public function normalizePath( string $path ): string
	{
		// zamień ukośniki wsteczne na zwykłe ukośniki
		$path = str_replace( '\\', '/', $path );

		// usuń nieprawidłowe znaki
        while( preg_match('#\p{C}+|^\./#u', $path) )
            $path = preg_replace( '#\p{C}+|^\./#u', '', $path );

		$parts  = [];
		$pieces = explode( '/', $path );

		// sprawdzaj każdą część ścieżki
		foreach( $pieces as $part )
			switch ($part)
			{
				case '':
				case '.':
				break;
				case '..':
					if( empty($parts) )
						throw new \Exception( 'Outside!' );

					array_pop($parts);
				break;
				default:
					$parts[] = $part;
				break;
			}

		// połącz części na ścieżkę
		return implode( '/', $parts );
	}

	public function getRealPath( string $path ): string
	{
		// normalizuj ścieżkę
		$path = $this->normalizePath( $path );
		$path = BASE_PATH . 'files/' . $path;

		// sprawdź czy ścieżka zawiera nazwę bazową - nie pozwól cofnąć się
		// poza folder w którym użytkownik może wykonywać akcje
		if( strpos( $path, BASE_PATH . 'files' ) !== 0 )
		{
			throw new \Exception( $p );
		}

		return $path;
	}

	public function listDirectories( string $path, bool $sub ): array
	{
		$directories = [];
		$iterator    = new \DirectoryIterator( $path );

		// szukaj katalogów w katalogu
		foreach( $iterator as $entity )
		{
			if( !$entity->isDir() || $entity->isDot() )
				continue;

			// twórz listę katalogów gdy funkcja na to zezwala
			$directories[] = [
				'name'     => $entity->getFilename(),
				'modify'   => $entity->getMTime(),
				'access'   => $entity->getATime(),
				'children' => $sub
					? $this->listDirectories( $entity->getRealPath(), true )
					: []
			];
		}
		return $directories;
	}

	public function listEntities( string $path ): array
	{
		$entities = [];
		$iterator = new \DirectoryIterator( $path );

		// szukaj elementów w katalogu
		foreach( $iterator as $entity )
		{
			// nie uwzględniaj linków
			if( $entity->isLink() || $entity->isDot() )
				continue;

			// uzupełnij informacje o pliku
			$entities[] = [
				'name'   => $entity->getFilename(),
				'size'   => $entity->getSize(),
				'modify' => $entity->getMTime(),
				'access' => $entity->getATime(),
				'type'   => $entity->getType(),
				'mime'   => $entity->isDir()
					? ''
					: $this->getMimeType( $entity->getFilename() )
			];
		}
		return $entities;
	}

	public function createDirectory( string $path ): array
	{
		// sprawdź czy ścieżka jest pusta
		if( $path == '' )
			return [
				'status'   => '406',
				'message'  => 'Not Acceptable',
				'response' => 'You must provide directory path'
			];

		// sprawdź czy pod tą nazwą zapisany jest już folder lub plik
		if( file_exists($path) )
			return [
				'status'   => '409',
				'message'  => 'Conflict',
				'response' => 'Directory or file with this name already exists'
			];

		// sprawdź czy ścieżka do tworzonego folderu istnieje
		if( !is_dir(dirname($path)) )
			return [
				'status'   => '406',
				'message'  => 'Not Acceptable',
				'response' => 'Path to directory not exist'
			];

		// spróbuj utworzyć plik
		if( mkdir($path) )
			return [
				'status'   => '200',
				'message'  => 'OK',
				'response' => 1
			];

		// niepoprawne uprawnienia lub problem z tworzeniem pliku
		return [
			'status'   => '403',
			'message'  => 'Forbidden',
			'response' => 'Directory can\'t be created in this path'
		];
	}

	public function getMimeType( string $path, bool $real = true ): string
	{
		$mimes = $this->di->getShared( 'mimes' );

		$ext  = pathinfo( $path, PATHINFO_EXTENSION );
		$mime = !$ext || $ext == ''
			? 'text/plain'
			: (!isset( $mimes[$ext] )
				? ''
				: $mimes[$ext]
			);

		// prawdziwy typ
		if( $real )
			return $mime;

		// typ obsługiwany przez aplikację
		$valid_mimes = [
			'image/png'  => 1,
			'image/jpeg' => 1,
			'image/gif'  => 1
		];

		// w przypadku gdy aplikacja nie obsługuje typu, zwraca text/plain
		$type = isset( $valid_mimes[$mime] )
			? $mime
			: 'text/plain';

		return $type;
	}
}
