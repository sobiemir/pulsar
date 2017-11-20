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

interface NodeList
{
	/**
	 * Szuka indeksu wśród elementów z użyciem podanej funkcji.
	 *
	 * PARAMETERS:
	 *     func: (elem: any) => boolean
	 *         Funkcja używana podczas wyszukiwania indeksu.
	 * RETURNS: number
	 *     Indeks pierwszego elementu spełniającego wymagania funkcji.
	 */
	findIndex( func: (elem: any) => boolean ): number;
}

interface Array<T>
{
	/**
	 * Sortuje elementy w drzewie używając podanej funkcji.
	 *
	 * PARAMETERS:
	 *     func: (a: any, b: any) => number
	 *         Funkcja używana podczas sortowania elementów.
	 *     index: Indeks względem którego wyszukiwane będą dzieci.
	 */
	deepSort( func: (a: T, b: T) => number, index: string ): void;
}

interface Element
{
	/**
	 * Skrót funkcji querySelector pozwalający na bezpośrednie rzutowanie.
	 *
	 * PARAMETERS:
	 *     selector: string
	 *         Selektor względem którego wyszukiwany będzie element.
	 */
	$<T extends Element = Element>( selector: string ): T;

	/**
	 * Skrót funkcji querySelectorAll pozwalający na bezpośrednie rzutowanie.
	 *
	 * PARAMETERS:
	 *     selector: string
	 *         Selektor względem którego wyszukiwane będą elementy.
	 */
	$$<T extends Element = Element>( selector: string ): NodeListOf<T>;
}

interface Document
{
	/**
	 * Skrót funkcji querySelector pozwalający na bezpośrednie rzutowanie.
	 *
	 * PARAMETERS:
	 *     selector: string
	 *         Selektor względem którego wyszukiwany będzie element.
	 */
	$<T extends Element = Element>( selector: string ): T;

	/**
	 * Skrót funkcji querySelectorAll pozwalający na bezpośrednie rzutowanie.
	 *
	 * PARAMETERS:
	 *     selector: string
	 *         Selektor względem którego wyszukiwane będą elementy.
	 */
	$$<T extends Element = Element>( selector: string ): NodeListOf<T>;
}

/**
 * Skrót funkcji querySelector pozwalający na bezpośrednie rzutowanie.
 *
 * PARAMETERS:
 *     selector: string
 *         Selektor względem którego wyszukiwany będzie element.
 */
declare var $:
	<T extends Element = Element>( selector: string ) => T;

/**
 * Skrót funkcji querySelectorAll pozwalający na bezpośrednie rzutowanie.
 *
 * PARAMETERS:
 *     selector: string
 *         Selektor względem którego wyszukiwane będą elementy.
 */
declare var $$:
	<T extends Element = Element>( selector: string ) => NodeListOf<T>;

// =============================================================================

$ = function<T extends Element>( selector: string ): T
{
	return <T>document.querySelector( selector );
};

$$ = function<T extends Element = Element>( selector: string ): NodeListOf<T>
{
	return <NodeListOf<T>>document.querySelectorAll( selector );
};

// =============================================================================

NodeList.prototype.findIndex = function( func ): number
{
	for( let x = 0; x < this.length; ++x )
		if( func(this[x]) )
			return x;
	return -1;
};

// =============================================================================

Array.prototype.deepSort = function( func, index ): void
{
	for( let x = 0; x < this.length; ++x )
		if( index in this[x] )
			this[x][index].deepSort( func, index );
	this.sort( func );
};

// =============================================================================

Element.prototype.$ =
	function<T extends Element = Element>( selector: string ): T
{
	return <T>this.querySelector( selector );
};

Element.prototype.$$ =
	function<T extends Element = Element>( selector: string ): NodeListOf<T>
{
	return <NodeListOf<T>>this.querySelectorAll( selector );
};

// =============================================================================

Document.prototype.$  = $;
Document.prototype.$$ = $$;
