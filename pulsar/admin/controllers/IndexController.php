<?php
namespace Pulsar\Admin;
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

use Pulsar\Helper\BaseController;

class IndexController extends BaseController
{
	public function indexAction()
	{
		$this->view->setVars( array_merge($this->_vars, [
			'title'      => 'Pulsar :: Kokpit',
			'hasSidebar' => false,
			'breadcrumb' => [
				[
					'name' => 'Kokpit',
					'url'  => '/admin'
				]
			]
		]) );
	}

	public function loginAction()
	{
		$this->view->setMainView(
			APP_PATH . 'admin/views/' . $this->config->admin->theme . '/login'
		);
		$this->view->setVar( 'title', 'Logowanie do panelu administratora' );
	}
}
