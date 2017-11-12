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

namespace Pulsar\Helper;

use Pulsar\Interfaces\ITabElement;

/**
 * Klasa tworząca zakładkę dla kontrolki z zakładkami.
 *
 * DESCRIPTION:
 *     Jest to podstawowa klasa używana przy tworzeniu kontrolki z zakładkami.
 *     Definiuje tylko funkcje które wymaga interfejs ITab.
 *     Same wartości można podać bezpośrednio w konstruktorze, ułatwiając przy
 *     tym proces tworzenia zakładek.
 */
class TabElement implements ITabElement
{
	/**
	 * Identyfikator wyświetlanego elementu.
	 *
	 * TYPE: integer
	 */
	private $id = null;

	/**
	 * Czy element jest wyłączony (niemożliwy do zaznaczenia)?
	 *
	 * TYPE: boolean
	 */
	private $disabled = null;

	/**
	 * Nazwa wyświetlanego elementu w kontrolce.
	 *
	 * TYPE: string
	 */
	private $name = '';

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
	 * Zwraca nazwę wyświetlaną na zakładce.
	 *
	 * RETURNS: string
	 *     Nazwa wyświetlana na elemencie.
	 */
	public function getName(): string
	{
		return $this->name;
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
