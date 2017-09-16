<?php
/*
 *  This file is part of Pulsar CMS
 *  Copyright (c) by sobiemir <sobiemir@aculo.pl>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

namespace Pulsar\Library;

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
