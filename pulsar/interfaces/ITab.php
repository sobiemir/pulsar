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

namespace Pulsar\Interfaces;

/**
 * Interfejs dla klas pozwalających na wyświetlenie w kontrolce z zakładkami.
 *
 * DESCRIPTION:
 *     Wymusza implementację funkcji przez klasę która będzie podstawą do
 *     pobierania danych potrzebnych do wyświetlenia zakładki.
 *     Zakładka do wyświetlenia potrzebuje informacji o jej identyfikatorze,
 *     nazwie oraz o tym czy jest aktywna (dostępna do przełączenia).
 */
interface ITab
{
	/**
	 * Pobiera identyfikator zakładki.
	 * 
	 * RETURNS: integer
	 *     Identyfikator zakładki.
	 */
	public function getId(): int;

	/**
	 * Pobiera nazwę wyświetlaną na zakładce.
	 *
	 * RETURNS: string
	 *     Nazwę wyświetlaną na zakładce.
	 */
	public function getName(): string;

	/**
	 * Sprawdza czy zakładka jest wyłączona.
	 *
	 * RETURNS: boolean
	 *     Czy zakładka jest wyłączona?
	 */
	public function isDisabled(): bool;
}
