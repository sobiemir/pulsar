
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

	protected _callObject: any;

// =============================================================================

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

	public getParent(): RenderArrayTree<TYPE>
	{
		return this._parent;
	}

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

// =============================================================================

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
	 * Tworzy nową obserwowaną tablicę z podelementów aktualnego elementu.
	 *
	 * PARAMETERS:
	 *     values: TYPE[]
	 *         Tablica zawierająca podelementy.
	 *     parent: RenderArray<TYPE>
	 *         Tablica nadrzędna, która jest rodzicem elementów.
	 *
	 * RETURNS: RenderArray<TYPE>
	 *     Tablicę zawierającą obserwowane wartości będącą podtablicą aktualnej.
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

		const observable = new RenderArrayTree<TYPE>( this, val );
		observable.options(
		{
			childIndex:   this._index,
			treeSelector: this._tree,
			place:        this._place,
			template:     this._template
		} );
		observable._subscribers = this._subscribers;
		observable.set( (obs.value as any)[this._index] );

		val.extra.child = observable;
		return val;
	}
}
