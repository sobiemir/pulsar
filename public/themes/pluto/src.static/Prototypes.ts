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

// =============================================================================

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

// =============================================================================

interface Number
{
	/**
	 * Skraca liczbę do najlepszej i najbliższej wykrytej jednostki.
	 *
	 * DESCRIPTION:
	 *     Skrócona liczba będzie zakończona wartością reprezentującą jednostkę.
	 *     Liczba początkowa od której rozpoczynać się będzie skracanie
	 *     traktowana jest jako liczba bajtów.
	 *
	 * RETURNS: string
	 *     Zamienioną do najlepszej jednostki liczbę.
	 */
	toSizeString(): string;

	/**
	 * Formatuje liczbę na datę, traktując ją jako znacznik czasowy.
	 *
	 * DESCRIPTION:
	 *     Znacznik czasu rozpoczyna datę od 1 stycznia 1970 roku.
	 *     Wyjściowy format daty jest zawsze taki sam: HH:mm - dd/MM/yyyy.
	 *
	 * RETURNS: string
	 *     Data utworzona ze znacznika czasowego.
	 */
	toDateString(): string;
}

// =============================================================================

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

// =============================================================================

interface String
{
	/**
	 * Formatuje ciąg znaków używając podanych argumentów.
	 * 
	 * PARAMETERS:
	 *     args: any[]
	 *         Argumenty formatowane w ciągu.
	 * 
	 * RETURNS: string
	 *     Ciąg wyjściowy.
	 */
	formatArgs( args: any[] ): string;
}

// =============================================================================

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

// =============================================================================

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

/**
 * Uzupełnia obiekt względem kluczy w elementach przekazywanego obiektu.
 *
 * DESCRIPTION:
 *     Pozwala na uzupełnienie obiektu wartościami z przekazanego obiektu.
 *     Obiektem wynikowym będzie obiekt z kluczami przekazanego obiektu.
 *     Aby wszystko działało, obiekt musi być uprzednio zainicjalizowany.
 *
 * EXAMPLE:
 *     elems = $("[data-panels]");
 *     obj.fillByKey( elems, "dataset", "panel" );
 *
 * PARAMETERS:
 *     o  Obiekt którym wartości będą uzupełniane.
 *     k1 Pierwszy klucz sprawdzania indeksu.
 *     k2 Drugi klucz sprawdzania indeksu (opcjonalny).
 */
declare var $fill: ( o1: any, o2: any, k1: string, k2?: string ) => void;

// =============================================================================

$ = function<T extends Element>( selector: string ): T
{
	return <T>document.querySelector( selector );
};

$$ = function<T extends Element = Element>( selector: string ): NodeListOf<T>
{
	return <NodeListOf<T>>document.querySelectorAll( selector );
};

$fill = function( o1: any, o2: any, k1: string, k2?: string ): void
{
	if( k2 && k1 )
	{
		for( const elem of o2 )
			if( elem[k1][k2] in o1 )
				o1[elem[k1][k2]] = elem;
		return;
	}

	for( const elem of o2 )
		if( elem[k1] in o1 )
			o1[elem[k1]] = elem;
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

Number.prototype.toSizeString = function(): string
{
	const sizes = ['B', 'KiB', 'MiB', 'GiB'];

	if( !this )
		return '0 B';
	const index = ~~Math.floor( Math.log(this) / Math.log(1024) );

	if( !index )
		return `${this} ${sizes[index]}`;

	return `${(this / (1024 ** index)).toFixed(2)} ${sizes[index]}`;
};

Number.prototype.toDateString = function(): string
{
	const date = new Date( this * 1000 );

	const year    = date.getFullYear();
	const month   = date.getMonth() + 1;
	const day     = date.getDate();
	const hours   = date.getHours();
	const minutes = date.getMinutes();

	return (hours > 9 ? hours : "0" + hours) + ":" +
		(minutes > 9 ? minutes : "0" + minutes) + " - " +
		(day > 9 ? day : "0" + day) + "/" +
		(month > 9 ? month  : "0" + month) + "/" + year;
};

// =============================================================================

String.prototype.formatArgs = function( args: any[] ): string
{
	return this.replace( /{(\d+)}/g, (match: string, index: number) =>
	{
		return args[index]
			? args[index]
			: match;
	} );
};

// =============================================================================

Document.prototype.$  = $;
Document.prototype.$$ = $$;
