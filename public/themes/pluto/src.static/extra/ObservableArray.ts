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
 * Klasa tworząca tablicę obserwowanych wartości.
 *
 * DESCRIPTION:
 *     Każda zmiana w tablicy - dodawanie czy usuwanie elementu - odnotowywana
 *     jest w podpiętych do klasy funkcjach.
 *     Aby jednak zmiana mogła zostać odnotowana, każda operacja musi być
 *     wykonywana przy użyciu wbudowanych w klasę funkcji.
 *     Własna zmiana lub dodanie elementu do tablicy nie zostanie odnotowane.
 */
class ObservableArray<TYPE>
{
	/**
	 * Lista obserwowanych wartości z których tworzone są elementy.
	 *
	 * TYPE: IObservableValue<TYPE>[]
	 */
	protected _values: IObservableValue<TYPE>[];

	/**
	 * Lista połączonych funkcji wywoływanych przy odświeżaniu elementów.
	 *
	 * TYPE: IObservableFunction<TYPE>[]
	 */
	protected _subscribers: IObservableFunction<TYPE>[];

// -----------------------------------------------------------------------------

	/**
	 * Konstruktor klasy.
	 */
	public constructor()
	{
		this._values      = [];
		this._subscribers = [];
	}

	/**
	 * Dodaje funkcję do funkcji powiązanych, wywoływanych przy aktualizacji.
	 *
	 * DESCRIPTION:
	 *     Wiele funkcji może znajdować się pod jednym indeksem, dzięki temu
	 *     wywołanie funkcji unsubscribe zwalnia wszystkie funkcje zapisane
	 *     do danego indeksu.
	 *     Funkcja wywoływana jest w takiej kolejności w jakiej została dodana,
	 *     nie ma więc znaczenia czy dodana została do indeksu którego funkcja
	 *     dodana została wcześniej.
	 * 
	 * PARAMETERS:
	 *     funct: Funkcja wywoływana przy aktualizacji tablicy.
	 *     index: Indeks pod którym zapisana będzie funkcja.
	 */
	public subscribe( funct: TObservableArrayFunc<TYPE>, index: string ): void
	{
		this._subscribers.push( {
			name: index,
			func: funct
		} );
	}

	/**
	 * Zwalnia funkcje aktualizacji przypisane do danego indeksu.
	 * 
	 * PARAMETERS:
	 *     index: string
	 *         Indeks do którego zapisana zostanie funkcja.
	 */
	public unsubscribe( index: string ): void
	{
		let idx = -1;
		do
		{
			idx = this._subscribers.findIndex( val => val.name == index);
			if( idx > -1 )
				this._subscribers.splice( idx, 1 );
		}
		while( idx > -1 );
	}

	/**
	 * Pobiera tablicę elementów które zostały wstawione do klasy.
	 *
	 * RETURNS: TYPE[]
	 *     Tablicę elementów które zawiera klasa.
	 */
	public get(): TYPE[]
	{
		return this._values.map( val => val.value );
	}

	/**
	 * Pobiera tablicę obserwowanych wartości.
	 *
	 * RETURNS: IObservableValue<TYPE>[]
	 *     Tablicę obserwowanych wartości.
	 */
	public getObservables(): IObservableValue<TYPE>[]
	{
		return this._values;
	}

	/**
	 * Ustawia nowe elementy w tablicy.
	 *
	 * PARAMETERS:
	 *     values: TYPE[]
	 *         Tablica elementów do wstawienia.
	 */
	public set( values: TYPE[] ): void
	{
		this._values = values.map( val => this._valueConverter(
		{
			element:    null,
			value:      val,
			needUpdate: true,
			wasUpdated: false,
			extra:      this
		}) );
		this.runSubscribers();
	}

	/**
	 * Czyści tablicę z wszystkich elementów.
	 */
	public clear(): void
	{
		this._values.length = 0;
		this.runSubscribers();
	}

	/**
	 * Odwraca elementy w tablicy.
	 */
	public reverse(): void
	{
		this._values.reverse();
		this.runSubscribers();
	}

	/**
	 * Wstawia do tablicy na koniec podane wartości.
	 *
	 * PARAMETERS:
	 *     vals: ...TYPE[]
	 *         Lista wartości do wstawienia.
	 * RETURNS: number
	 *     Ilość elementów w tablicy po wstawieniu.
	 */
	public push( ...vals: TYPE[] ): number
	{
		const num = this._values.push( ...vals.map(val => this._valueConverter(
		{
			element:    null,
			value:      val,
			needUpdate: true,
			wasUpdated: false,
			extra:      this
		})) );
		this.runSubscribers();
		return num;
	}

	/**
	 * Usuwa ostatnią wartość z tablicy, zwracając ją.
	 *
	 * RETURNS:
	 *     Usuniętą wartość z tablicy.
	 */
	public pop(): TYPE
	{
		const v = this._values.pop();
		this.runSubscribers();

		return v.value;
	}

	/**
	 * Dodaje do tablicy na początek podane wartości.
	 *
	 * PARAMETERS:
	 *     vals: ...TYPE[]
	 *         Lista wartości do wstawienia.
	 * RETURNS: number
	 *     Ilość elementów w tablicy po wstawieniu.
	 */
	public unshift( ...vals: TYPE[] ): number
	{
		const n = this._values.unshift( ...vals.map(val => this._valueConverter(
		{
			element:    null,
			value:      val,
			needUpdate: true,
			wasUpdated: false,
			extra:      this
		})) );
		this.runSubscribers();
		return n;
	}

	/**
	 * Usuwa pierwszą wartość z tablicy, zwracając ją.
	 *
	 * RETURNS:
	 *     Usuniętą wartość z tablicy.
	 */
	public shift(): TYPE
	{
		const v = this._values.shift();
		this.runSubscribers();

		return v.value;
	}

	/**
	 * Uruchamia wszystkie funkcje powiązane z obserwowaną tablicą.
	 */
	public runSubscribers(): void
	{
		for( let x = 0; x < this._subscribers.length; ++x )
			this._subscribers[x].func( this );
	}

// -----------------------------------------------------------------------------

	/**
	 * Pozwala na konwersję wartości do innego obiektu niż oryginalny.
	 *
	 * PARAMETERS:
	 *     values: IObservableValue<TYPE>
	 *         Wartości do zamiany na inną tablicę.
	 * RETURNS: IObservable
	 *     Tablicę z nowymi wartościami, tutaj przekazywana w parametrze.
	 */
	protected _valueConverter( values: IObservableValue<TYPE> ):
		IObservableValue<TYPE>
	{
		return values;
	}
}
