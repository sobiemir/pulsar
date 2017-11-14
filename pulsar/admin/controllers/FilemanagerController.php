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

namespace Pulsar\Admin;

use Phalcon\Http\Response;
use Pulsar\Service\Filemanager;

class FilemanagerController extends Base
{
	public function indexAction(): void
	{
		$this->view->setVars( array_merge($this->_vars, [
			'data'       => [],
			'languages'  => $all,
			'switch'     => $switch,
			'title'      => 'Pulsar :: Menedżer plików',
			'breadcrumb' => [
				[
					'name' => 'Narzędzia',
					'url'  => '/admin/tools'
				], [
					'name' => 'Menedżer plików',
					'url'  => '/admin/filemanager'
				]
			],
			'hasSidebar' => false,
			'topButtons' => [],
			'pageAccess' => [],
			'showColumn' => [],
			'showAction' => []
		]) );
	}
}
