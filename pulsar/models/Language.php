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

namespace Pulsar\Model;

use Phalcon\Mvc\Model\Resultset;
use Pulsar\Helper\Utils;
use Pulsar\Interfaces\ITabElement;

class Language extends \Phalcon\Mvc\Model implements ITabElement
{
	/**
	 * Identyfikator języka.
	 *
	 * TYPE: integer
	 */
	public $id = null;

	/**
	 * Czy język jest dostępny dla użytkownika strony?
	 *
	 * TYPE: boolean
	 */
	public $frontend = false;

	/**
	 * Czy język jest dostępny dla użytkownika panelu administracyjnego?
	 *
	 * TYPE: boolean
	 */
	public $backend = false;

	/**
	 * Identyfikator języka przypisanego do menu.
	 *
	 * DESCRIPTION:
	 *     Wartość L oznacza układ tekstu od lewej do prawej, zaś wartość
	 *     R układ tekstu do prawej do lewej strony.
	 *
	 * TYPE: string
	 */
	public $direction = 'L';

	/**
	 * Indeks względem którego menu jest sortowane.
	 *
	 * TYPE: integer
	 */
	public $order = 0;

	/**
	 * Kod języka (powinien być jak najkrótszy).
	 *
	 * TYPE: string
	 */
	public $code = '';

	/**
	 * Domyślna nazwa języka wyświetlana gdy nie występuje w tłumaczeniach.
	 *
	 * TYPE: string
	 */
	public $default_name = '';

// =============================================================================

	/**
	 * Lista języków utworzonych systemie.
	 *
	 * TYPE: Language[]
	 */
	protected static $_all_langs = [];

	/**
	 * Aktualnie używany przez użytkownika język.
	 *
	 * TYPE: Language
	 */
	protected static $_curr_lang = null;

	/**
	 * Lista języków dostępnych na stronie.
	 *
	 * TYPE: Language[]
	 */
	protected static $_front_langs = [];

	/**
	 * Lista języków dostępnych dla panelu administratora.
	 *
	 * TYPE: Language[]
	 */
	protected static $_back_langs = [];

// =============================================================================

	/**
	 * Inicjalizuje dane dla modelu.
	 */
	public function initialize(): void
	{
		$this->hasMany(
			'id',
			'\Pulsar\Model\Menu',
			'id_language'
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
		return 'language';
	}

	/**
	 * Funkcja używana przy kontrolkach, zwraca identyfikator języka.
	 *
	 * RETURNS: int
	 *     Identyfikator języka.
	 */
	public function getId(): int
	{
		return $this->id;
	}

	/**
	 * Funkcja używana przy kontrolkach, zwraca wyświetlaną nazwę języka.
	 *
	 * RETURNS: string
	 *     Nazwę języka do wyświetlenia.
	 */
	public function getName(): string
	{
		return $this->default_name;
	}

	/**
	 * Sprawdza czy język jest wyłączony z użytku.
	 * 
	 * RETURNS: boolean
	 *     Informację o tym czy język jest nieaktywny.
	 */
	public function isDisabled(): bool
	{
		return !$this->frontend && !$this->backend;
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
	 * RETURNS: Language
	 *     Język spełniający podane kryteria.
	 */
	public static function findFirst( $parameters = null ): Language
	{
		return parent::findFirst( $parameters );
	}

	/**
	 * Ustawia aktualny język strony.
	 *
	 * DESCRIPTION:
	 *     Funkcja ta ma wpływ tylko i wyłącznie na wyświetlanie witryny dla
	 *     danego użytkownika.
	 *     Każdy użytkownik może mieć inny wyświetlany język, więc zmienna
	 *     ta nie wiąże się ze stałą zmianą języka dla wszystkich użytkowników.
	 *
	 * PARAMETERS:
	 *     $id (string):
	 *         Identyfikator języka który ma być używany jako główny.
	 */
	public static function setLanguage( string $id ): void
	{
		if( empty(Language::$_curr_lang) )
		{
			Language::findAndStore( $id );
			return;
		}

		if( Language::$_curr_lang->id != $id )
		{
			Language::$_curr_lang = reset( Language::$_all_langs );

			foreach( Language::$all_langs as $lang )
				if( $lang->id == $id )
					Language::$_curr_lang = $lang;
		}
	}

	/**
	 * Zwraca wszystkie dostępne języki w aplikacji.
	 *
	 * DESCRIPTION:
	 *     Funkcja zwraca wszystkie języki, niezależnie od tego czy są dostępne
	 *     dla administratora lub użytkownika strony czy też są całkowicie
	 *     wyłączone z użytku.
	 * 
	 * RETURNS:
	 *     Listę wszystkich utworzonych języków.
	 */
	public static function getAll(): array
	{
		if( empty(Language::$_all_langs) )
			Language::findAndStore();

		return Language::$_all_langs;
	}

	/**
	 * Zwraca aktualnie ustawiony język.
	 *
	 * RETURNS: Language
	 *     Język aktualnie używany w aplikacji.
	 */
	public static function getCurrent(): Language
	{
		if( empty(Language::$_curr_lang) )
		{
			if( empty(Language::$_all_langs) )
				Language::findAndStore();

			Language::$_curr_lang = current( Language::$_all_langs );
		}
		return Language::$_curr_lang;
	}

	/**
	 * Zwraca języki dostępne dla użytkownika przeglądającego stronę.
	 *
	 * RETURNS: Language[]
	 *     Listę języków dostępnych dla użytkownika strony.
	 */
	public static function getFrontend(): array
	{
		if( empty(Language::$_front_langs) )
			Language::findAndStore();

		return Language::$_front_langs;
	}

	/**
	 * Zwraca języki dostępne dla panelu administratora.
	 *
	 * RETURNS: Language[]
	 *     Listę języków dostępnych dla panelu administratora.
	 */
	public static function getBackend(): array
	{
		if( empty(Language::$_back_langs) )
			Language::findAndStore();

		return Language::$_back_langs;
	}

// =============================================================================

	/**
	 * Pobiera języki z bazy i zapisuje do odpowiednich pól w klasie.
	 *
	 * PARAMETERS:
	 *     $id (string):
	 *         Identyfikator języka który ma zostać ustawiony jako aktualny.
	 */
	private static function findAndStore( int $id = null ): void
	{
		// pobierz języki z bazy danych
		$langs = Language::find([
			'order' => '[order]'
		]);

		if( count($langs) == 0 )
			throw new \Exception( "No language available in database!" );

		// jeżeli wartość nie została podana, ustaw pierwszy lepszy język
		if( !$id )
			$id = $langs[0]->id;

		// uzupełnij tablice w oparciu o pobrane języki
		foreach( $langs as $lang )
		{
			if( $lang->id == $id )
				Language::$_curr_lang = $lang;

			if( $lang->frontend )
				Language::$_front_langs[] = $lang;

			if( $lang->backend )
				Language::$_back_langs[] = $lang;

			Language::$_all_langs[$lang->id] = $lang;
		}
	}
}
