<?php
namespace Pulsar\Library;
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

use Phalcon\Security;
use Pulsar\Model\Users;

class Authorization extends Security
{
	/**
	 * Logowanie użytkownika do systemu.
	 * Sprawdza czy podane dane są poprawne i tworzy sesje użytkownika.
	 * 
	 * @param  string $username Nazwa użytkownika.
	 * @param  string $password Hasło użytkownika.
	 * @return int              Numer błędu lub 0 w przypadku zalogowania.
	 */
	public function loginUser( string $username, string $password ): int
	{
		// sprawdź czy pola są puste - nie mogą być
		if( trim($username) == '' || trim($password) == '' )
			return 1;
		
		// wyszukaj użytkownika o podanej nazwie
		$user = Users::findFirst([
			'username = :username:',
			'bind' => [
				'username' => $username
			]
		]);

		// sprawdź czy hasło jest poprawne
		if( $user && $this->checkHash($password, $user->password) )
			return 0;

		// jeżeli nie ma użytkownika, wygeneruj hash aby zapobiec atakom czasowym
		if( !$user )
			$this->hash( rand() );

		return 2;
	}

	public function logoutUser()
	{
	}

	public function checkUser()
	{
	}

	private function _createUserSession()
	{
	}

	private function _createUserCookie()
	{
	}
}
