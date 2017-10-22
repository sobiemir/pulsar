<?php
namespace Pulsar\Helper;
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

class ControlElement
{
	/**
	 * Identyfikator wyświetlanego elementu.
	 *
	 * TYPE: integer
	 */
	public $id = null;

	/**
	 * Czy element jest wyłączony (niemożliwy do zaznaczenia)?
	 *
	 * TYPE: boolean
	 */
	public $disabled = null;

	/**
	 * Nazwa wyświetlanego elementu w kontrolce.
	 *
	 * TYPE: string
	 */
	public $name = '';

// =============================================================================

	/**
	 * Konstruktor klasy.
	 *
	 * PARAMETERS:
	 *     $id (integer):
	 *         Identyfikator elementu.
	 *     $name (string):
	 *         Wyświetlana nazwa elementu.
	 *     $disabled (boolean):
	 *         Czy element jest wyłączony?
	 */
	public function __construct( int $id, string $name, bool $disabled = false )
	{
		$this->id       = $id;
		$this->name     = $name;
		$this->disabled = $disabled;
	}

	/**
	 * Zwraca identyfikator elementu.
	 *
	 * RETURNS: integer
	 *     Identyfikator elementu.
	 */
	public function getId(): int
	{
		return $this->id;
	}

	/**
	 * Sprawdza czy język jest wyłączony z użytku.
	 * 
	 * RETURNS: boolean
	 *     Informację o tym czy język jest nieaktywny.
	 */
	public function isDisabled(): bool
	{
		return $this->disabled;
	}
}
