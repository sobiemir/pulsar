<?php
namespace Pulsar\Model;
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

use Pulsar\Helper\Utils;
use Phalcon\Mvc\Model\Resultset;

class Menu extends \Phalcon\Mvc\Model
{
	/**
	 * Identyfikator menu w postaci GUID.
	 *
	 * TYPE: string
	 */
	public $id = null;

	/**
	 * Identyfikator języka przypisanego do menu w postaci GUID.
	 *
	 * TYPE: string
	 */
	public $id_language = null;

	/**
	 * Czy menu jest prywatne?
	 *
	 * DESCRIPTION:
	 *     Prywatne menu nie jest wyświetlane dla użytkownika, jednak jego
	 *     poszczególne strony mogą być widoczne.
	 *
	 * TYPE: boolean
	 */
	public $private = false;

	/**
	 * Czy menu jest dostępne?
	 *
	 * TYPE: boolean
	 */
	public $online = false;

	/**
	 * Indeks względem którego menu jest sortowane.
	 *
	 * TYPE: integer
	 */
	public $order = 0;

	/**
	 * Nazwa menu wyświetlana w panelu administratora.
	 *
	 * TYPE: string
	 */
	public $name = '';

// =============================================================================

	/**
	 * Identyfikator menu w formacie GUID.
	 *
	 * TYPE: string
	 */
	private $_id = null;

	/**
	 * Identyfikator języka menu w formacie GUID.
	 *
	 * TYPE: string
	 */
	private $_id_language = null;

// =============================================================================

	/**
	 * Inicjalizuje dane dla modelu.
	 */
	public function initialize(): void
	{
		$this->belongsTo(
			'id_language',
			'\Pulsar\Model\Language',
			'id'
		);
	}

	/**
	 * Zwraca nazwę tabeli do której przypięty jest model.
	 *
	 * RETURNS: string
	 *     Nazwę tabeli docelowej.
	 */
	public function getSource(): string
	{
		return 'menu';
	}

	/**
	 * Zwraca identyfikator menu w formacie binarnym.
	 *
	 * RETURNS: string
	 *     Identyfikator menu w formacie binarnym pobrany z tabeli.
	 */
	public function getRawId(): string
	{
		return $this->id;
	}

	/**
	 * Zwraca identyfikator języka w formacie binarnym.
	 *
	 * RETURNS: string
	 *     Identyfikator języka w formacie binarnym pobrany z tabeli.
	 */
	public function getRawVariant(): string
	{
		return $this->id_language;
	}

	/**
	 * Zwraca identyfikator menu w formacie GUID.
	 *
	 * RETURNS: string
	 *     Identyfikator menu skonwertowany na typ GUID.
	 */
	public function getId(): string
	{
		if( !$this->_id )
			$this->_id = Utils::BinToGUID( $this->id );
		return $this->_id;
	}

	/**
	 * Zwraca identyfikator języka w formacie GUID.
	 *
	 * RETURNS: string
	 *     Identyfikator języka skonwertowany na typ GUID.
	 */
	public function getVariant(): string
	{
		if( !$this->_id_language )
			$this->_id_language = Utils::BinToGUID( $this->id_language );
		return $this->_id_language;
	}

	/**
	 * Pobiera rekordy z tabeli spełniające podane kryteria.
	 *
	 * PARAMETERS:
	 *     $parameters (array | string):
	 *         Kryteria wyszukiwania danych w tabeli.
	 *
	 * RETURNS: Resultset
	 *     Listę rekordów spełniających podane kryteria pobranych z tabeli
	 *     zawierającej listę menu.
	 */
	public static function find( $parameters = null ): Resultset
	{
		return parent::find( $parameters );
	}

	/**
	 * Pobiera pierwszy dostępny rekord spełniający podane kryteria.
	 *
	 * PARAMETERS:
	 *     $parameters (array | string):
	 *         Kryteria wyszukiwania danych w tabeli.
	 *
	 * RETURNS: Menu
	 *     Menu spełniające podane kryteria.
	 */
	public static function findFirst( $parameters = null ): Menu
	{
		return parent::findFirst( $parameters );
	}
}
