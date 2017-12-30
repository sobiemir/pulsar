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

// =============================================================================

/**
 * Inferfejs dla obserwowanego obiektu.
 */
interface IObservableValue<TYPE>
{
	/**
	 * Element renderowany przez klasę wstawiany przy odświeżaniu elementów.
	 *
	 * TYPE: HTMLElement
	 */
	element: HTMLElement;

	/**
	 * Aktualna wartość elementu w liście.
	 *
	 * TYPE: TYPE
	 */
	value: TYPE;

	/**
	 * Czy element wymaga aktualizacji przy odświeżaniu?
	 *
	 * TYPE: boolean
	 */
	needUpdate: boolean;

	/**
	 * Czy element był aktualizowany?
	 *
	 * TYPE: boolean
	 */
	wasUpdated: boolean;

	/**
	 * Dodatkowe informacje na temat obiektu zależne od obserwującej klasy.
	 *
	 * TYPE: any
	 */
	extra: any;
}

// =============================================================================

/**
 * Interfejs zawierający informacje o subskrybującej funkcji.
 */
interface IObservableFunction<TYPE>
{
	/**
	 * Nazwa indeksu do którego przypisywana jest funkcja.
	 * 
	 * TYPE: string
	 */
	name: string;

	/**
	 * Funkcja wywoływana przy odświeżaniu tablicy obserwowanych elementów.
	 *
	 * TYPE: TObservableArrayFunc<TYPE>
	 */
	func: TObservableArrayFunc<TYPE>;
}

// =============================================================================

type TObservableArrayFunc<TYPE> = (obs: ObservableArray<TYPE>) => void;
