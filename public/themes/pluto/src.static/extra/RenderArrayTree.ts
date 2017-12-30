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
 * Klasa tworząca tablicę wyświetlającą drzewo elementów przy użyciu szablonu.
 *
 * DESCRIPTION:
 *     Każdy wyświetlany element z listy korzysta z tego samego szablonu.
 *     Do przetwarzania szablonów wykorzystywana jest biblioteka doT.
 *     Każdy z elementów może posiadać listę elementów podrzędnych (dzieci).
 *     Przed użyciem należy zapoznać się z funkcją o nazwie "options", gdzie
 *     można ustawić opcje dotyczące przetwarzania i wyświetlania szablonu.
 *     Drzewo można modyfikować również po utworzeniu, każda zmiana zostanie
 *     odnotowana w przypisanych do klasy funkcjach.
 *     Funkcje przypisywane do klasy nadrzędnej kopiowane są automatycznie do
 *     wszystkich klas podrzędnych (w głąb drzewa).
 */
class RenderArrayTree<TYPE> extends ObservableArray<TYPE>
{
	/**
	 * Szablon skompilowany przez bibliotekę doT.
	 *
	 * TYPE: doT.RenderFunction
	 */
	protected _template: doT.RenderFunction;

	/**
	 * Miejsce do którego elementy będą wrzucane.
	 *
	 * TYPE: HTMLElement
	 */
	protected _place: HTMLElement;

	/**
	 * Nazwa selektora w przypadku renderowania drzewa elementów.
	 *
	 * TYPE: string
	 */
	protected _tree: string;

	/**
	 * Indeks używany przy dostępie do dzieci w drzewie.
	 * 
	 * TYPE: string
	 */
	protected _index: string;

	/**
	 * Rodzic tablicy w przypadku tworzenia drzewa.
	 *
	 * TYPE: RenderArray<TYPE>
	 */
	protected _parent: RenderArrayTree<TYPE>;

	/**
	 * Wartość względem której podpinany jest rodzic.
	 *
	 * TYPE: IObservableValue<TYPE>
	 */
	protected _upper: IObservableValue<TYPE>;

	/**
	 * Obiekt główny w szablonie, zazwyczaj jest to "this".
	 * 
	 * TYPE: any
	 */
	protected _callObject: any;

// -----------------------------------------------------------------------------

	/**
	 * Konstruktor klasy.
	 */
	public constructor(
		parent: RenderArrayTree<TYPE> = null,
		upper: IObservableValue<TYPE> = null
	) {
		super();

		this._template = null;
		this._place    = null;
		this._tree     = null;
		this._index    = '';
		this._parent   = parent;
		this._upper    = upper;
	}

	/**
	 * Możliwe do ustawienia opcje dla klasy RenderArrayTree.
	 *
	 * DESCRIPTION:
	 *     Opcje warto ustawić jeszcze przed wstawianiem elementów do tablicy.
	 *     Zmiana opcji spowoduje odświeżenie widoku elementów.
	 *
	 * PARAMETERS:
	 *     options: IRenderArrayTreeOptions
	 *         Lista opcji do zmiany.
	 */
	public options( options: IRenderArrayTreeOptions ): void
	{
		if( options.childIndex )
			this._index = options.childIndex;
		if( options.treeSelector )
			this._tree = options.treeSelector;
		if( options.place )
			this._place = options.place;
		if( options.template )
			this._template = typeof options.template == "function"
				? options.template
				: doT.template( options.template );
		this._callObject = options.callObject || this;

		this.runSubscribers();
	}

	/**
	 * Pobiera nadrzędną listę elementów do której odnosi się aktualna lista.
	 *
	 * RETURNS: RenderArrayTree<TYPE>
	 *     Nadrzędna lista do której odnosi się jest aktualna lista.
	 */
	public getParent(): RenderArrayTree<TYPE>
	{
		return this._parent;
	}

	/**
	 * Pobiera element z listy nadrzędnej do którego przypisana jest lista.
	 *
	 * RETURNS: IObservableValue<TYPE>
	 *     Element do którego przypisana jest lista.
	 */
	public getUpper(): IObservableValue<TYPE>
	{
		return this._upper;
	}

	/**
	 * Renderuje elementy z obserwowanej tablicy w aplikacji.
	 *
	 * DESCRIPTION;
	 *     Uruchomienie tej funkcji spowoduje aktualizację widoku w elemencie
	 *     do którego podpięta jest klasa Observable.
	 *     W przypadku gdy generowane są wszystkie elementy na raz (aktywna
	 *     opcja single), żaden z wyrenderowanych elementów nie ma odnośnika.
	 *     Niemożliwe jest więc prawidłowe przeskanowanie wartości które
	 *     elementy się zmieniły, więc subskrypcje stają się wtedy nieco
	 *     bezużyteczne.
	 */
	public runSubscribers(): void
	{
		if( !this._place || !this._template || !this._index || !this._tree )
			return;

		// usuń wszystkie dzieci
		while( this._place.lastChild )
			this._place.removeChild( this._place.lastChild );

		this._render();

		super.runSubscribers();
	}

	/**
	 * Tworzy poddrzewo elementów względem aktualnego drzewa.
	 *
	 * PARAMETERS:
	 *     upper: IObservableValue<TYPE>
	 *         Obserwowana zmienna do której drzewo ma zostać podpięte.
	 *     child: TYPE[]
	 *         Dzieci do podpięcia do drzewa.
	 */
	public createChild( upper: IObservableValue<TYPE>, child: TYPE[] ): void
	{
		// jeżeli zmienna posiada już dziecko, zostaw...
		if( upper.extra.child )
			return;

		// utwórz nową tablicę
		const observable = new RenderArrayTree<TYPE>( this, upper );
		observable.options(
		{
			childIndex:   this._index,
			treeSelector: this._tree,
			place:        this._place,
			template:     this._template
		} );
		// kopiuj subskrypcje i ustaw elementy dziecka
		observable._subscribers = this._subscribers;
		observable.set( child );

		// i zapisz tablicę do zmiennej
		upper.extra.child = observable;
	}

// -----------------------------------------------------------------------------

	/**
	 * Renderuje elementy z obserwowanej tablicy w aplikacji.
	 *
	 * DESCRIPTION:
	 *     Funkcja wywołuje samą siebie w przypadku gdy włączona została opcja
	 *     generowania elementów w drzewie.
	 *     Aby wygenerować drzewo należy wcześniej podać selektor dla elementu
	 *     w którym będą generowane podelementy.
	 *
	 * PARAMETERS:
	 *     values: IRenderElement<TYPE>[]
	 *         Obserwowane wartości w tablicy.
	 */
	protected _render(): void
	{
		for( const value of this._values )
		{
			value.wasUpdated = false;

			// sprawdź czy element wymaga aktualizacji
			if( value.needUpdate )
			{
				const div = document.createElement( "div" );
				div.innerHTML = this._template.call(
					this._callObject,
					value.value
				);
				value.element = div.firstChild as HTMLElement;

				value.needUpdate = false;
				value.wasUpdated = true;
			}
			const extra = value.extra as IRenderTreeExtra<TYPE>;

			// dodaj element do rodzica
			extra.owner._place.appendChild( value.element );

			if( !extra.child )
				continue;

			// zapisz miejsce generowania elementów do obserwowanej tablicy
			extra.child.options( {
				place: value.element.$<HTMLElement>( this._tree )
			} );

			extra.child.runSubscribers();
		}
	}

	/**
	 * Pozwala na konwersję wartości do innego obiektu niż oryginalny.
	 *
	 * DESCRIPTION:
	 *     Funkcja ta jest rozszerzeniem oryginalnej funkcji _valueConverter.
	 *     Pozwala na tworzenie podelementów w drzewie, korzystając z indeksu
	 *     podanego w opcjach.
	 *
	 * PARAMETERS:
	 *     values: IObservableValue<TYPE>
	 *         Wartości do zamiany na inną tablicę.
	 * RETURNS: IObservable
	 *     Tablicę z nowymi wartościami, tutaj przekazywana w parametrze.
	 */
	protected _valueConverter( obs: IObservableValue<TYPE> ):
		IObservableValue<TYPE>
	{
		const val = {
			element:    obs.element,
			value:      obs.value,
			needUpdate: obs.needUpdate,
			wasUpdated: obs.wasUpdated,
			extra: {
				owner: this,
				child: null
			} as IRenderTreeExtra<TYPE>
		} as IObservableValue<TYPE>;

		if( !(obs.value as any)[this._index] ||
			!(obs.value as any)[this._index].length )
			return val;

		this.createChild( val, (obs.value as any)[this._index] );
		return val;
	}
}
