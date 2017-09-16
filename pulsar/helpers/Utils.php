<?php
namespace Pulsar\Helper;
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

use Phalcon\Security\Random;

class Utils
{
	/**
	 * Klasa Random używana do generowania GUID.
	 */
	private static $_random = null;

	/**
	 * Generuje nowy numer GUID.
	 */
	public static function GenerateGUID(): string
	{
		if( Utils::$_random == null )
			Utils::$_random = new Random();

		return Utils::$_random->uuid();
	}

	/**
	 * Generuje nowy numer GUID i zwraca go w postaci binarnej.
	 */
	public static function GenerateBinGUID(): string
	{
		if( Utils::$_random == null )
			Utils::$_random = new Random();

		return Utils::GUIDToBin( Utils::$_random->uuid() );
	}

	/**
	 * Zamienia GUID z czytelnej dla człowieka formy na binarną.
	 *
	 * GUID od UUID różni się sposobem przechowywania w formie binarnej.
	 * UUID jest przeważnie kodowany tylko w formacie Big Endian.
	 * W przypadku GUID mieszane są dwa formaty - Big Endian i Little Endian.
	 * Szczegóły na ten temat można znaleźć tutaj:
	 * https://en.wikipedia.org/wiki/Universally_unique_identifier
	 *
	 * @param $guid GUID do zamiany na ciąg binarny.
	 */
	public static function GUIDToBin( string $guid ): string
	{
		$guid = str_replace( '-', '', $guid );

		// LITTLE ENDIAN     | BIG ENDIAN
		// ------------------------------------
		// 01234567 8901 2345 6789 012345678901
		// xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
		return pack( 'H*',
			substr( $guid, 6,  2 ) . substr( $guid, 4, 2 ) .
			substr( $guid, 2,  2 ) . substr( $guid, 0, 2 ) .
			substr( $guid, 10, 2 ) . substr( $guid, 8, 2 ) .
			substr( $guid, 14, 2 ) . substr( $guid, 12, 2 ) .
			substr( $guid, 16, 16 )
		);
	}

	/**
	 * Zamienia GUID z formy binarnej na czytelną dla człowieka.
	 * 
	 * Funkcja uzyskana z komentarzy na stronie z dokumentacją PHP:
	 * https://secure.php.net/manual/en/function.mssql-guid-string.php
	 * 
	 * @param $bin Ciąg binarny 128 bitowy do zamiany na czytelny GUID.
	 */
	public static function BinToGUID( string $bin ): string
	{
		$guid = unpack( 'Va/v2b/n2c/Nd', $bin );

		return sprintf(
			'%08x-%04x-%04x-%04x-%04x%08x',
			$guid['a'],
			$guid['b1'],
			$guid['b2'],
			$guid['c1'],
			$guid['c2'],
			$guid['d']
		);
	}
}
