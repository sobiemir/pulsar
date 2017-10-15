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

/**
 * Klasa kontrolki zawierającej zakładki.
 *
 * DESCRIPTION:
 *     Klasa pozwala na standardowe wyświetlanie zakładek i przełączanie się
 *     pomiędzy kontekstami (panelami) podpiętymi do kontrolki.
 *     Każdy kontekst który ma zostać wyświetlony po kliknięciu w daną zakładkę
 *     musi być do niej podpięty przy użyciu parametru 'data-variant', gdzie
 *     sprawdzany jest z parametrem 'data-id' zakładki.
 *     
 *     Aby jednak kontrolka podczas tworzenia mogłą znaleźć podpięte elementy
 *     należy zdefiniować dla niej parametr 'data-search' który ma zawierać
 *     regułę dla funkcji 'querySelectorAll', która szuka podpiętych elementów.
 *     Dodatkowo parametr 'data-form' pozwala na zawężenie wyszukiwania danych
 *     do konkretnego formularza.
 *     
 *     Kontrolka jednak nie oranicza się tylko do zmiany wyświetlanych danych.
 *     Pozwala również na zmianę flagi ich wyświetlania.
 *     Podanie parametru 'data-message' pozwala na wyświetlanie wiadomości
 *     w przypadku gdy elementy podpięte pod zakładkę nie mają być wyświetlane.
 *     Użycie warunkowego wyświetlania danych wymaga jednak utworzenia
 *     dodatkowego elementu, najlepiej 'input' o typie 'hidden'.
 *     Jako wartość parametru 'name' musi przyjmować 'flag:ID', gdzie ID jest
 *     identyfikatorem zakładki podawanym w 'data-id'.
 *     Dodatkowo musi posiadać parametr 'data-mflag', po którym będzie pobierany
 *     z listy wszystkich kontrolek.
 *     Wartość takiego elementu to "0" lub "1", gdzie "0" wyświetla wiadomość
 *     a wartość "1" pozwala na wyświetlanie podpiętych kontrolek.
 */
export class TabControl
{
	/**
	 * Formularz względem którego wyszukiwane będą kolejne elementy.
	 *
	 * TYPE: HTMLElement | Document
	 */
	private _form: HTMLElement | Document = null;

	/**
	 * Flagi względem których wyświetlane będą kontrolki lub wiadomość.
	 *
	 * TYPE: NodeListOf<HTMLInputElement>
	 */
	private _flags: NodeListOf<HTMLInputElement> = null;

	/**
	 * Wiadomość do wyświetlenia w przypadku gdy flaga na to pozwoli.
	 *
	 * TYPE: HTMLElement
	 */
	private _message: HTMLElement = null;

	/**
	 * Główny element kontrolki.
	 *
	 * TYPE: HTMLElement
	 */
	private _control: HTMLElement = null;

	/**
	 * Kontener w którym kontolki będą wyszukiwane.
	 *
	 * TYPE: HTMLElement
	 */
	private _search: HTMLElement = null;

	/**
	 * Lista kontrolek w poszczególnych wariantach.
	 *
	 * TYPE: NodeListOf<HTMLElement>
	 */
	private _variants: NodeListOf<HTMLElement> = null;

	/**
	 * Lista zakładek w kontrolce.
	 *
	 * TYPE: NodeListOf<HTMLLIElement>
	 */
	private _tabs: NodeListOf<HTMLLIElement> = null;

	/**
	 * Indeks zaznaczonej zakładki.
	 *
	 * TYPE: number
	 */
	private _selected: number = -1;

	/**
	 * Przycisk służący do zmiany flagi modelu (usuwanie).
	 *
	 * TYPE: HTMLElement
	 */
	private _remove: HTMLElement = null;

	/**
	 * Przycisk służący do zmiany flagi modelu (tworzenie).
	 *
	 * TYPE: HTMLElement
	 */
	private _create: HTMLElement = null;

	/**
	 * Flaga błędu przetwarzania danych w kontrolce.
	 *
	 * TYPE: boolean
	 */
	private _failed: boolean = false;

// =============================================================================

	/**
	 * Konstruktor kontrolki.
	 *
	 * PARAMETERS:
	 *     tab: (HTMLElement)
	 *         Element z którego tworzona będzie kontrolka.
	 */
	public constructor( tab: HTMLElement )
	{
		this._selected = -1;
		this._control  = tab;

		// element główny z którego bedą pobierane dane
		this._form = tab.dataset.form !== undefined
			? document.querySelector( tab.dataset.form ) as HTMLElement
			: document;

		if( !this._form )
		{
			this._failed = true;
			return;
		}

		// wiadomość w przypadku gdy model jest oznaczony jako nieistniejący
		if( tab.dataset.message !== undefined )
		{
			this._message = <HTMLElement>
				this._form.querySelector( tab.dataset.message );
			this._flags = <NodeListOf<HTMLInputElement>>
				this._form.querySelectorAll( "input[data-mflag" );
		}
		else
		{
			this._message = null;
			this._flags   = null;
		}

		// przycisk usuwania danych z zakładki
		if( tab.dataset.remove !== undefined )
			this._remove = <HTMLElement>
				this._form.querySelector( tab.dataset.remove );
		// przycisk dodawania danych do zakładki
		if( tab.dataset.create !== undefined )
			this._create = <HTMLElement>
				this._form.querySelector( tab.dataset.create );

		// element w którym wyszukiwane są warianty
		this._search = <HTMLElement>
			this._form.querySelector( tab.dataset.search );

		if( !this._search )
		{
			this._failed = true;
			return;
		}

		// lista wariantów
		this._variants = <NodeListOf<HTMLElement>>
			this._search.querySelectorAll( "[data-variant]" );

		if( !this._variants || this._variants.length === 0 )
			this._failed = true;

		// lista zakładek w kontrolce
		this._tabs = <NodeListOf<HTMLLIElement>>tab.querySelectorAll( "li" );

		if( !this._tabs || this._tabs.length === 0 )
			this._failed = true;
	}

	/**
	 * Pobiera wartość parametru o podanym indeksie.
	 *
	 * PARAMETERS:
	 *     index: (string)
	 *         Indeks z którego wartość parametru ma zostać pobrana.
	 *
	 * RETURNS: (any)
	 *     Wartość parametru o podanym indeksie.
	 */
	public get( index: string ): any
	{
		const name = `_${index}`;

		if( name in this )
			return (<any>this)[name];

		return null;
	}

	/**
	 * Dodaje zdarzenia do kontrolki.
	 *
	 * DESCRIPTION:
	 *     Kontrolka oprócz przełączania kontekstu i zakładek obsługuje również
	 *     inne akcje, jak np. czyszczenie lub ustawianie flagi modelu.
	 *     Szczegóły dotyczące tego jak działają te opcje i jak je ustawić
	 *     znajdują się w opisie klasy.
	 */
	public addEvents(): void
	{
		if( this._failed )
			return;

		this._control.addEventListener( "click", this._onTabChange );

		// te dwa przyciski wiążą się ze sobą, więc muszą być razem
		if( !this._create || !this._remove )
			return;

		this._create.addEventListener( "click", this._onCreateLanguage );
		this._remove.addEventListener( "click", this._onRemoveLanguage );
	}

	/**
	 * Zmienia zaznaczoną zakładkę w kontrolce.
	 *
	 * PARAMETERS:
	 *     index: (number)
	 *         Indeks zakładki która ma być zaznaczona.
	 *     force: (boolean) = false
	 *         Wymuszenie odświeżenia gdy indeks jest taki sam jak aktualny.
	 */
	public selectTab( index: number, force: boolean = false ): void
	{
		// sprawdź czy zakładka nie jest czasem już zaznaczona
		if( this._failed || (!force && this._selected === index)
			|| !(index in this._tabs) )
			return;

		const newli = this._tabs[index];
		const newid = newli.dataset.id;
		const oldid = this._selected !== -1
			? this._tabs[this._selected].dataset.id
			: null;

		// zaznacz odpowiednią zakładkę
		if( oldid )
			this._tabs[this._selected].classList.remove( "selected" );
		newli.classList.add( "selected" );

		// pokaż pola przypisane do zakładki
		for( let x = 0; x < this._variants.length; ++x )
		{
			const variant = this._variants[x];

			if( variant.dataset.variant == newid )
				variant.classList.remove( "hidden" );
			else if( variant.dataset.variant == oldid )
				variant.classList.add( "hidden" );
		}

		// razem ze zmianą zakładki zmienia się też tryb wyświetlania danych
		if( this._message != null && this._flags.length > 0 )
		{
			// nazwa elementu do sprawdzenia
			const fname = `flag:${newid}`;

			// przeszukuj wszystkie flagi
			for( let x = 0; x < this._flags.length; ++x )
			{
				const flag = this._flags[x];

				if( flag.name == fname && this._remove && this._create )
				{
					// i jeżeli flaga jest dopuszczona do widoku, wyświetl dane
					if( flag.value == "1" )
					{
						this._message.classList.add( "hidden" );
						this._search.classList.remove( "hidden" );
						this._remove.classList.remove( "hidden" );
						this._create.classList.add( "hidden" );
					}
					// w przeciwnym wypadku wyświetl komunikat
					else
					{
						this._message.classList.remove( "hidden" );
						this._search.classList.add( "hidden" );
						this._remove.classList.add( "hidden" );
						this._create.classList.remove( "hidden" );
					}
					break;
				}
			}
		}
		this._selected = index;
	}

// =============================================================================

	/**
	 * Akcja wywoływana podczas zmiany zakładki w kontrolce.
	 *
	 * PARAMETERS:
	 *     ev: (MouseEvent)
	 *         Argumenty zdarzenia.
	 */
	private _onTabChange = ( ev: MouseEvent ) =>
	{
		const newli = <HTMLElement>ev.target;
		if( newli.tagName != "LI" )
			return;

		// wyszukaj indeks nowego elementu
		const newidx = this._tabs.findIdxByFunc( (elem: HTMLElement) =>
			elem.dataset.id == newli.dataset.id
		);

		this.selectTab( newidx );
	}

	/**
	 * Akcja wywoływana po kliknięciu w przycisk tworzenia języka.
	 *
	 * DESCRIPTION:
	 *     Wyświetla kontrolki formularza dla zaznaczonego języka ukrywając
	 *     wiadomość o braku tłumaczenia.
	 *     Dodatkowo zmienia flagę modelu używaną przy zapisie danych.
	 *
	 * PARAMETERS:
	 *     ev: (MouseEvent)
	 *         Argumenty zdarzenia.
	 */
	private _onCreateLanguage = ( ev: MouseEvent ) =>
	{
		if( this._failed )
			return;

		const fname = `flag:${this._tabs[this._selected].dataset.id}`;
		const index = this._flags.findIdxByFunc( (elem: HTMLInputElement) =>
			elem.name === fname
		);

		if( index === -1 )
			return;

		this._create.classList.add( "hidden" );
		this._remove.classList.remove( "hidden" );

		this._flags[index].value = "1";
		this.selectTab( this._selected, true );
	}

	/**
	 * Akcja wywoływana po kliknięciu w przycisk usuwania języka.
	 *
	 * DESCRIPTION:
	 *     Wyświetla wiadomość o braku tłumaczenia dla zaznaczonego języka
	 *     ukrywając kontrolki formularza.
	 *     Dodatkowo zmienia flagę modelu używaną przy zapisie danych.
	 *
	 * PARAMETERS:
	 *     ev: (MouseEvent)
	 *         Argumenty zdarzenia.
	 */
	private _onRemoveLanguage = ( ev: MouseEvent ) =>
	{
		if( this._failed )
			return;

		if( !window.confirm("Czy na pewno chcesz usunąć to tłumaczenie?") )
			return;

		const fname = `flag:${this._tabs[this._selected].dataset.id}`;
		const index = this._flags.findIdxByFunc( (elem: HTMLInputElement) =>
			elem.name === fname
		);

		if( index === -1 )
			return;

		this._remove.classList.add( "hidden" );
		this._create.classList.remove( "hidden" );

		this._flags[index].value = "0";
		this.selectTab( this._selected, true );
	}
}
