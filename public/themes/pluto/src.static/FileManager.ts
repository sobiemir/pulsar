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

class FileManager
{
	/**
	 * Główny element na którym opiera się menedżer plików.
	 *
	 * TYPE: HTMLElement
	 */
	private _filemgr: HTMLElement = null;
	private _directories: NodeListOf<HTMLElement> = null;


// =============================================================================

	/**
	 * Konstruktor kontrolki.
	 *
	 * PARAMETERS:
	 *     tab: (HTMLElement)
	 *         Główny element na którym opiera się menedżer plików.
	 */
	public constructor( div: HTMLElement )
	{
		this._filemgr     = div;
		this._directories = <NodeListOf<HTMLElement>>
			this._filemgr.querySelectorAll( ".directory-panel" );

		// // element główny z którego bedą pobierane dane
		// this._form = tab.dataset.form !== undefined
		// 	? document.querySelector( tab.dataset.form ) as HTMLElement
		// 	: document;

		// if( !this._form )
		// {
		// 	this._failed = true;
		// 	return;
		// }

		// // wiadomość w przypadku gdy model jest oznaczony jako nieistniejący
		// if( tab.dataset.message !== undefined )
		// {
		// 	this._message = <HTMLElement>
		// 		this._form.querySelector( tab.dataset.message );
		// 	this._flags = <NodeListOf<HTMLInputElement>>
		// 		this._form.querySelectorAll( "input[data-mflag" );
		// }
		// else
		// {
		// 	this._message = null;
		// 	this._flags   = null;
		// }

		// // przycisk usuwania danych z zakładki
		// if( tab.dataset.remove !== undefined )
		// 	this._remove = <HTMLElement>
		// 		this._form.querySelector( tab.dataset.remove );
		// // przycisk dodawania danych do zakładki
		// if( tab.dataset.create !== undefined )
		// 	this._create = <HTMLElement>
		// 		this._form.querySelector( tab.dataset.create );

		// // element w którym wyszukiwane są warianty
		// this._search = <HTMLElement>
		// 	this._form.querySelector( tab.dataset.search );

		// if( !this._search )
		// {
		// 	this._failed = true;
		// 	return;
		// }

		// // lista wariantów
		// this._variants = <NodeListOf<HTMLElement>>
		// 	this._search.querySelectorAll( "[data-variant]" );

		// if( !this._variants || this._variants.length === 0 )
		// 	this._failed = true;

		// // lista zakładek w kontrolce
		// this._tabs = <NodeListOf<HTMLLIElement>>tab.querySelectorAll( "li" );

		// if( !this._tabs || this._tabs.length === 0 )
		// 	this._failed = true;
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
		// if( this._failed )
		// 	return;

		// this._control.addEventListener( "click", this._onTabChange );

		// // te dwa przyciski wiążą się ze sobą, więc muszą być razem
		// if( !this._create || !this._remove )
		// 	return;

		// this._create.addEventListener( "click", this._onCreateLanguage );
		// this._remove.addEventListener( "click", this._onRemoveLanguage );
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
		// // sprawdź czy zakładka nie jest czasem już zaznaczona
		// if( this._failed || (!force && this._selected === index)
		// 	|| !(index in this._tabs) )
		// 	return;

		// const newli = this._tabs[index];
		// const newid = newli.dataset.id;
		// const oldid = this._selected !== -1
		// 	? this._tabs[this._selected].dataset.id
		// 	: null;

		// // zaznacz odpowiednią zakładkę
		// if( oldid )
		// 	this._tabs[this._selected].classList.remove( "selected" );
		// newli.classList.add( "selected" );

		// // pokaż pola przypisane do zakładki
		// for( let x = 0; x < this._variants.length; ++x )
		// {
		// 	const variant = this._variants[x];

		// 	if( variant.dataset.variant == newid )
		// 		variant.classList.remove( "hidden" );
		// 	else if( variant.dataset.variant == oldid )
		// 		variant.classList.add( "hidden" );
		// }

		// // razem ze zmianą zakładki zmienia się też tryb wyświetlania danych
		// if( this._message != null && this._flags.length > 0 )
		// {
		// 	// nazwa elementu do sprawdzenia
		// 	const fname = `flag:${newid}`;

		// 	// przeszukuj wszystkie flagi
		// 	for( let x = 0; x < this._flags.length; ++x )
		// 	{
		// 		const flag = this._flags[x];

		// 		if( flag.name == fname && this._remove && this._create )
		// 		{
		// 			// i jeżeli flaga jest dopuszczona do widoku, wyświetl dane
		// 			if( flag.value == "1" )
		// 			{
		// 				this._message.classList.add( "hidden" );
		// 				this._search.classList.remove( "hidden" );
		// 				this._remove.classList.remove( "hidden" );
		// 				this._create.classList.add( "hidden" );
		// 			}
		// 			// w przeciwnym wypadku wyświetl komunikat
		// 			else
		// 			{
		// 				this._message.classList.remove( "hidden" );
		// 				this._search.classList.add( "hidden" );
		// 				this._remove.classList.add( "hidden" );
		// 				this._create.classList.remove( "hidden" );
		// 			}
		// 			break;
		// 		}
		// 	}
		// }
		// this._selected = index;
	}

// =============================================================================

	/**
	 * Akcja wywoływana podczas zmiany zakładki w kontrolce.
	 *
	 * PARAMETERS:
	 *     ev: (MouseEvent)
	 *         Argumenty zdarzenia.
	 */
	private _onTabChange = ( ev: MouseEvent ): void =>
	{
		// if( this._failed )
		// 	return;

		// const newli = <HTMLElement>ev.target;
		// if( newli.tagName != "LI" )
		// 	return;

		// // wyszukaj indeks nowego elementu
		// const newidx = this._tabs.findIdxByFunc( (elem: HTMLElement) =>
		// 	elem.dataset.id == newli.dataset.id
		// );

		// this.selectTab( newidx );
	}
}
