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

class IndexController extends Controller
{
	public function indexAction()
	{
		$this->view->setVars([
			'title'      => 'Pulsar :: Kokpit',
			'hasSidebar' => false,
			'breadcrumb' => 'Kokpit'
		]);
	}

	public function loginAction()
	{
		$this->view->setMainView( APP_PATH . 'admin/views/login' );
		$this->view->setVar( 'title', 'Logowanie do panelu administratora' );
	}
}
