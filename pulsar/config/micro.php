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

use Phalcon\Mvc\Micro\Collection;

$collections = [];

$filemanager = new Collection();
$filemanager->setHandler( '\Pulsar\Micro\FilemanagerController', true );
$filemanager->setPrefix( '/filemanager' );
$filemanager->get(
	'/directories',
	'directoriesAction'
);
$filemanager->get(
	'/directories/{recursive:(1|0)}',
	'directoriesAction'
);
$filemanager->get(
	'/directories/{recursive:(1|0)}/{path:(.*)}',
	'directoriesAction'
);
$filemanager->get(
	'/entities',
	'entitiesAction'
);
$filemanager->get(
	'/entities/{path:(.*)}',
	'entitiesAction'
);

$collections[] = $filemanager;

return $collections;
