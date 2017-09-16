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

namespace Pulsar\Admin;

use Phalcon\Mvc\Controller;
use Pulsar\Models\Users;

/**
 * Kontroler sesji.
 * Uruchamiany tylko w przypadku logowania.
 * Gdy użytkownik jest zalogowany, przenosi go do ostatniej odwiedzanej strony.
 */
class SessionController extends Controller
{
	/**
	 * Akcja domyślna.
	 * Przekierowuje na stronę logowania.
	 * 
	 * @return void
	 */
	public function indexAction()
	{
		$this->response->redirect( '/admin/login' );
	}

	/**
	 * Akcja logowania użytkownika.
	 * Podczas logowania następuje automatycznie przekierowanie do stron w zależności od statusu.
	 * Gdy logowanie się powiedzie, skrypt przekierowuje na stronę główną administracji.
	 * Jeżeli nie, wraca na ekran logowania i wyświetla błąd.
	 * 
	 * @return bool Informacja o tym czy ma być wyświetlona strona.
	 */
	public function loginAction()
	{
		// sprawdź poprawność wysyłanych danych
		if( $this->request->isPost() )
		{
			$username = $this->request->getPost( 'username' );
			$password = $this->request->getPost( 'password' );

			// spróbuj zalgować użytkownika
			$retval = $this->security->loginUser( $username, $password );

			// sprawdź czy użytkownik się zalogował
			if( $retval == 0 )
			{
				$this->response->redirect( '/admin' );
				return false;
			}
			else if( $retval == 1 )
				$this->flashSession->warning( 'Poniższe pola nie mogą być puste!' );
			else
				$this->flashSession->error( 'Nieprawidłowe dane logowania!' );
		}

		// przekierowanie na panel logowania
		$this->response->redirect( '/admin/login' );
		return false;
	}

	public function logoutAction()
	{
		$this->security->logoutUser();
	}

	public function registerAction()
	{

	}

	public function deleteAction()
	{

	}
}
