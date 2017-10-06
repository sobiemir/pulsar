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

use Phalcon\Mvc\Model\Validator\Email as Email;
use Phalcon\Mvc\Model\Resultset;

class User extends \Phalcon\Mvc\Model
{
	/**
	 * Identyfikator użytkownika w postaci GUID.
	 *
	 * TYPE: string
	 */
	public $id = null;

	/**
	 * Unikalna nazwa użytkownika używana podczas logowania.
	 *
	 * TYPE: string
	 */
	public $username = null;

	/**
	 * Unikalna nazwa użytkownika wyświetlana na stronie.
	 *
	 * TYPE: string
	 */
	public $screen_name = '';

	/**
	 * Adres e-mail podany przez użytkownika.
	 *
	 * TYPE: string
	 */
	public $email = '';

	/**
	 * Uprzednio zhaszowane hasło podane przez użytkownika.
	 *
	 * DESCRIPTION:
	 *     Haszowanie hasła nie wymaga stosowania "soli".
	 *     Algorytm haszujący sam ją tworzy i dołącza do hasła, pobierając
	 *     ją przy sprawdzaniu i "soląc" nią hasło które ma być sprawdzane.
	 *     Metoda ta jest o tyle wygodna, że nie trzeba martwić się dodatkowymi
	 *     zabezpieczeniami związanymi z przechowywaniem hasła.
	 *
	 * TYPE: string
	 */
	public $password = '';

	/**
	 * Data rejestracji użytkownika na stronie.
	 *
	 * TYPE: string
	 */
	public $join_date = '';

	/**
	 * Status użytkownika.
	 *
	 * DESCRIPTION:
	 *     Generalnie jest kilka statusów użytkownika:
	 *         - 0x0: Konto nieaktywne
	 *         - 0x1: Użytkownik aktywny
	 *         - 0x2: Użytkownik wyłączony (konto dezaktywowane)
	 *         - 0x3: Użytkownik zbanowany
	 *     Na statusy systemowe zarezerwowane są wartości od 0x00 do 0xFF.
	 *     Pozostałe wartości są do dyspozycji pluginów, z czego wartości
	 *     te przydzielane są automatycznie przez system podczas instalacji
	 *     dodatku.
	 *
	 * TYPE: integer
	 */
	public $status = '';

// =============================================================================

	/**
	 * Sprawdza dane pod względem ich poprawności przed zapisem.
	 *
	 * RETURNS: boolean
	 *     Czy model przekazany do zapisu jest poprawny?
	 */
	public function validation(): bool
	{
		$this->validate(
			new Email(
				[
					'field'    => 'email',
					'required' => true,
				]
			)
		);

		if( $this->validationHasFailed() == true ) {
			return false;
		}

		return true;
	}

	/**
	 * Zwraca nazwę tabeli do której przypięty jest model.
	 *
	 * RETURNS: string
	 *     Nazwę tabeli docelowej.
	 */
	public function getSource(): string
	{
		return 'user';
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
	 * RETURNS: User
	 *     Użytkownika spełniającego podane kryteria.
	 */
	public static function findFirst( $parameters = null ): User
	{
		return parent::findFirst( $parameters );
	}

}
