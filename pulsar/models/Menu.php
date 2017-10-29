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

use Pulsar\Helper\Utils;
use Phalcon\Mvc\Model\Resultset;
use Phalcon\Di;

/**
 * Klasa pozwalająca na modyfikacje danych menu.
 *
 * DESCRIPTION:
 *     Klasa udostępnia takie funkcje jak odczyt, zapis, atkualizację oraz
 *     usuwanie menu.
 *     Sam odczyt może odbyć się na dwa sposoby - pobranie wszystkich elementów
 *     z bazy zgodnie z podanymi kryteriami lub pobranie elementów które nie
 *     zostały przetłumaczone na dany język.
 *     Dodatkową zmienną w klasie jest zmienna flag, odpowiadająca za aktualny
 *     stan modelu w aplikacji względem bazy danych.
 *     Lista flag opisana została w pliku zawierającym konfigurację modułu.
 */
class Menu extends \Phalcon\Mvc\Model
{
	/**
	 * Identyfikator menu.
	 *
	 * TYPE: integer
	 */
	public $id = null;

	/**
	 * Identyfikator języka przypisanego do menu.
	 *
	 * TYPE: integer
	 */
	public $id_language = null;

	/**
	 * Czy menu jest prywatne?
	 *
	 * DESCRIPTION:
	 *     Prywatne menu nie jest wyświetlane dla użytkownika, jednak jego
	 *     poszczególne strony mogą być widoczne.
	 *
	 * TYPE: integer
	 */
	public $private = 0;

	/**
	 * Czy menu jest dostępne?
	 *
	 * TYPE: integer
	 */
	public $online = 0;

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
	 * Flaga stanu dla modelu.
	 * 
	 * TYPE: integer
	 */
	private $_flag = ZMFLAG_SAVE;

// =============================================================================

	/**
	 * Pobiera rekordy z tabeli spełniające podane kryteria.
	 *
	 * PARAMETERS:
	 *     $params: array | string
	 *         Kryteria wyszukiwania danych w tabeli.
	 *
	 * RETURNS: Resultset
	 *     Listę rekordów spełniających podane kryteria pobranych z tabeli
	 *     zawierającej listę menu.
	 */
	public static function find( $params = null ): Resultset
	{
		return parent::find( $params );
	}

	/**
	 * Pobiera pierwszy dostępny rekord spełniający podane kryteria.
	 *
	 * PARAMETERS:
	 *     $params: array | string
	 *         Kryteria wyszukiwania danych w tabeli.
	 *
	 * RETURNS: Menu
	 *     Menu spełniające podane kryteria.
	 */
	public static function findFirst( $params = null ): Menu
	{
		return parent::findFirst( $params );
	}

	/**
	 * Pobiera pogrupowaną listę rekordów które nie zostały przetłumaczone
	 * na podany język.
	 *
	 * DESCRIPTION:
	 *     Dopuszczalne kryteria wyszukiwania danych w tabeli:
	 *     - limit:
	 *         największa dopuszczalna ilość pobieranych rekordów
	 *     - language:
	 *         aktualny język, rekordy z tym językiem nie będą wyszukiwane
	 *
	 * PARAMETERS:
	 *     $params (array):
	 *         Kryteria wyszukiwania danych w tabeli.
	 * 
	 */
	public static function findUntranslated( array $params ): array
	{
		$limit     = $params['limit']     ?? 30;
		$language  = $params['language']  ?? null;
		$languages = $params['languages'] ?? [];

		// pobierz listę identyfikatorów elementów które nie są przetłumaczone
		$untransids = Di::getDefault()->getModelsManager()->executeQuery('
			SELECT id FROM \Pulsar\Model\Menu as Menu
			WHERE (
				SELECT COUNT(InnerMenu.id)
					FROM \Pulsar\Model\Menu as InnerMenu
				WHERE Menu.id = InnerMenu.id
					AND InnerMenu.id_language = :lang:
			) = 0
			GROUP BY id
			LIMIT :limit:
			', [
				'lang'  => $language,
				'limit' => $limit
			], [
				'lang'  => \PDO::PARAM_INT,
				'limit' => \PDO::PARAM_INT
			]
		)->setHydrateMode( Resultset::HYDRATE_ARRAYS );

		// utwórz listę pobranych identyfikatorów
		$ids = [];
		foreach( $untransids as $untransid )
			$ids[] = $untransid['id'];

		if( count($ids) == 0 )
			return [];

		// pobierz nieptrzetłumaczone rekordy
		$untrans = Menu::find([
			'id IN ({ids:array})',
			'bind' => [
				'ids' => $ids
			]
		]);

		// grupuj elementy po identyfikatorze
		$groups = [];
		$retval = [];
		foreach( $untrans as $single )
		{
			if( !isset($groups[$single->id]) )
				$groups[$single->id] = [];

			if( isset($languages[$single->id_language]) )
			{
				$order = $languages[$single->id_language]->order;
				$groups[$single->id][$order] = $single;
			}
			else
				$groups[$single->id][] = $single;
		}

		// sortuj po polu "order"
		foreach( $groups as $group )
		{
			krsort( $group );
			$retval[] = array_values( $group );
		}

		return $retval;
	}

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
	 * Zwraca identyfikator menu.
	 *
	 * RETURNS: string
	 *     Identyfikator menu.
	 */
	public function getId(): string
	{
		return $this->id;
	}

	/**
	 * Zwraca identyfikator języka.
	 *
	 * RETURNS: string
	 *     Identyfikator języka.
	 */
	public function getVariant(): string
	{
		return $this->id_language;
	}

	/**
	 * Ustawia flagę dla modelu.
	 *
	 * DESCRIPTION:
	 *     Może przyjmować wartości:
	 *     - ZMFLAG_SAVE:
	 *         model przeznaczony do aktualizacji / zapisu
	 *     - ZMFLAG_NONE:
	 *         model tworzony jest na potrzeby wyświetlania lub usuwany
	 *
	 * PARAMETERS:
	 *     $flag: integer
	 *         Flaga przedstawiająca aktualny stan modelu.
	 *
	 * RETURNS: Menu
	 *     Instancja klasy Menu.
	 */
	public function setFlag( int $flag ): Menu
	{
		$this->_flag = $flag;
		return $this;
	}

	/**
	 * Pobiera flagę przedstawiającą aktualny stan modelu.
	 *
	 * RETURNS: integer
	 *     Flaga stanu modelu.
	 */
	public function getFlag(): int
	{
		return $this->_flag;
	}

	/**
	 * Sprawdza czy wartości w podanej tablicy różnią się od modelu.
	 * 
	 * PARAMETERS:
	 *     $data: array
	 *         Tablica zawierająca wartości do sprawdzenia.
	 *
	 * RETURNS: boolean
	 *     Czy wartości różnią się od tych podanych?
	 */
	public function hasDifference( array $data ): bool
	{
		return
			$data['name']    != $this->name ||
			$data['private'] != $this->private ||
			$data['online']  != $this->online;
	}
}
