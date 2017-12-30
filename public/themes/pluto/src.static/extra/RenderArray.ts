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
 * Klasa tworząca tablicę wyświetlającą listę elementów przy użyciu szablonu.
 *
 * DESCRIPTION:
 *     Każdy wyświetlany element z listy korzysta z tego samego szablonu.
 *     Do przetwarzania szablonów wykorzystywana jest biblioteka doT.
 *     Przed użyciem należy zapoznać się z funkcją o nazwie "options", gdzie
 *     można ustawić opcje dotyczące przetwarzania i wyświetlania szablonu.
 *     Renderowanie (wyświetlanie) szablonu następuje automatycznie przy
 *     odświeżaniu listy elementów.
 */
class RenderArray<TYPE> extends ObservableArray<TYPE>
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
	 * Czy renderować jeden szablon dla wszystkich elementów?
	 *
	 * TYPE: boolean
	 */
	protected _single: boolean;

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
	public constructor()
	{
		super();

		this._template = null;
		this._place    = null;
		this._single   = false;
	}

	/**
	 * Możliwe do ustawienia opcje dla klasy RenderArray.
	 *
	 * DESCRIPTION:
	 *     Opcje warto ustawić jeszcze przed wstawianiem elementów do tablicy.
	 *     Zmiana opcji spowoduje odświeżenie widoku elementów.
	 *
	 * PARAMETERS:
	 *     options: IRenderArrayOptions
	 *         Lista opcji do zmiany.
	 */
	public options( options: IRenderArrayOptions ): void
	{
		if( options.single )
			this._single = options.single;
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
	 * Uruchamia wszystkie funkcje powiązane z obserwowaną tablicą.
	 */
	public runSubscribers(): void
	{
		if( !this._place || !this._template )
			return;

		// tryb pojedynczego szablonu - wszystkie na raz
		if( this._single )
			this._place.innerHTML = this._template( this._values );
		// wszystkie osobno - szablon dla każdego elementu
		else
		{
			// usuń wszystkie dzieci
			while( this._place.lastChild )
				this._place.removeChild( this._place.lastChild );

			this._render();
		}

		super.runSubscribers();
	}

// -----------------------------------------------------------------------------

	/**
	 * Renderuje elementy z obserwowanej tablicy w aplikacji.
	 *
	 * DESCRIPTION:
	 *     Uruchomienie tej funkcji spowoduje aktualizację widoku w elemencie
	 *     do którego podpięta jest klasa RenderArray.
	 *     W przypadku gdy generowane są wszystkie elementy na raz (aktywna
	 *     opcja single), żaden z wyrenderowanych elementów nie ma odnośnika.
	 *     Niemożliwe jest więc prawidłowe przeskanowanie wartości które
	 *     elementy się zmieniły, więc subskrypcje stają się wtedy nieco
	 *     bezużyteczne.
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

			// dodaj element do rodzica
			value.extra._place.appendChild( value.element );
		}
	}
}
