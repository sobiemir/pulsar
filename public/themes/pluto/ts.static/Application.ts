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
import {TabControl} from "controls/TabControl";

/**
 * Wymagania przeglądarkowe dla statycznej wersji strony:
 *
 * IE:     11
 * EDGE:   12
 * FF:     6
 * CHROME: 8
 * SAFARI: 5.1
 * OPERA:  11.5
 */
export default class Application
{
	private _tabs: TabControl[] = [];

	public initTabControls(): void
	{
		// pobierz listę dostępnych przełączników
		const tabs = <NodeListOf<HTMLElement>>
			document.querySelectorAll( ".tab-control" );

		for( let x = 0; x < tabs.length; ++x ) {
			if( tabs[x].dataset.search === undefined )
				return;

			const tab = new TabControl( tabs[x] );

			// sprawdź która zakładka jest zaznaczona
			const selected = tab.get("tabs").findIdxByFunc( (elem: any) => {
				return elem.classList.contains( "selected" );
			} );
			this._tabs.push( tab );

			tab.addEvents();
			tab.selectTab( selected, true );

			this._tabs.push( tab );
		}

		// 	// sprawdź która zakładka jest zaznaczona
		// 	const selected = tab.tabs.findIdxByFunc( (elem: HTMLElement) => {
		// 		return elem.classList.contains( "selected" );
		// 	} );
		// 	this._tabs.push( tab );

		// 	tab.control.addEventListener( "click", (ev: MouseEvent) => {
		// 		// jeżeli wciśnięto coś innego niż "LI", zakończ
		// 		if( (<HTMLElement>ev.target).tagName != "LI" )
		// 			return;

		// 		this._changeElement( tab, <HTMLLIElement>ev.target );
		// 	} );

		// 	// zaraz po włączeniu zaznacz odpowiedni element
		// 	this._changeElement( tab, tab.tabs[
		// 		selected === -1
		// 			? 0
		// 			: selected
		// 	] );

		// 	if( tab.create )
		// 		tab.create.addEventListener( "click", (ev: MouseEvent) => {
		// 			const fname = `flag:${tab.tabs[tab.selected].dataset.id}`;
		// 			const index = tab.flags.findIdxByFunc( (elem) => {
		// 				return elem.name === fname;
		// 			} );

		// 			if( index === -1 )
		// 				return;

		// 			tab.create.classList.add( "hidden" );
		// 			if( tab.remove )
		// 				tab.remove.classList.remove( "hidden" );

		// 			tab.flags[index].value = "0";
		// 			const selected = tab.selected;
		// 			tab.selected = -1;
		// 			this._changeElement( tab, tab.tabs[selected] );
		// 		} );
		// 	if( tab.remove )
		// 		tab.remove.addEventListener( "click", (ev: MouseEvent) => {
		// 			if( !window.confirm(
		// 				"Czy na pewno chcesz usunąć to tłumaczenie?"
		// 			) ) {
		// 				return;
		// 			}

		// 			const fname = `flag:${tab.tabs[tab.selected].dataset.id}`;
		// 			const index = tab.flags.findIdxByFunc( (elem) => {
		// 				return elem.name === fname;
		// 			} );

		// 			if( index === -1 )
		// 				return;

		// 			tab.remove.classList.add( "hidden" );
		// 			if( tab.create )
		// 				tab.create.classList.remove( "hidden" );

		// 			tab.flags[index].value = "2";
		// 			const selected = tab.selected;
		// 			tab.selected = -1;
		// 			this._changeElement( tab, tab.tabs[selected] );
		// 		} );
		// }
	}

	// private _changeElement( tab: ITabControl, newli: HTMLLIElement ): void
	// {
	// 	if( tab.selected !== -1 && tab.tabs[tab.selected] === newli )
	// 		return;

	// 	// wyszukaj indeks nowego elementu
	// 	const newidx = tab.tabs.findIdxByFunc( (elem: HTMLElement) => {
	// 		return elem.dataset.id == newli.dataset.id;
	// 	} );

	// 	// podany element nie znajduje się w kontrolce...
	// 	if( newidx === -1 )
	// 		return;

	// 	let newid = null;
	// 	let oldid = null;

	// 	// zaznacz odpowiednią zakładkę w kontrolce
	// 	if( tab.selected !== -1 ) {
	// 		tab.tabs[tab.selected].classList.remove( "selected" );
	// 		oldid = tab.tabs[tab.selected].dataset.id;
	// 	}
	// 	newli.classList.add( "selected" );
	// 	newid = tab.tabs[newidx].dataset.id;

	// 	// pokaż pola przypisane do zakładki
	// 	for( let x = 0; x < tab.variants.length; ++x ) {
	// 		const variant = tab.variants[x];

	// 		if( variant.dataset.variant == newid )
	// 			variant.classList.remove( "hidden" );
	// 		else if( variant.dataset.variant == oldid )
	// 			variant.classList.add( "hidden" );
	// 	}

	// 	// razem ze zmianą zakładki zmienia się też tryb wyświetlania danych
	// 	// w zależności od tego czy kontrolki mają być wyświetlane czy nie
	// 	if( tab.message != null && tab.flags.length > 0 ) {
	// 		// nazwa elementu do sprawdzenia
	// 		const fname = `flag:${newid}`;

	// 		// przeszukuj wszystkie flagi
	// 		for( let x = 0; x < tab.flags.length; ++x ) {
	// 			const flag = <HTMLInputElement>tab.flags[x];

	// 			if( flag.name == fname )
	// 				// i jeżeli flaga jest dopuszczona do widoku, wyświetl dane
	// 				if( flag.value == "0" ) {
	// 					tab.message.classList.add( "hidden" );
	// 					tab.search.classList.remove( "hidden" );

	// 					if( tab.remove )
	// 						tab.remove.classList.remove( "hidden" );
	// 					if( tab.create )
	// 						tab.create.classList.add( "hidden" );
	// 				// w przeciwnym wypadku wyświetl komunikat
	// 				} else {
	// 					tab.message.classList.remove( "hidden" );
	// 					tab.search.classList.add( "hidden" );

	// 					if( tab.remove )
	// 						tab.remove.classList.add( "hidden" );
	// 					if( tab.create )
	// 						tab.create.classList.remove( "hidden" );
	// 				}
	// 		}
	// 	}
	// 	// zapisz indeks nowo zaznaczonej zakładki
	// 	tab.selected = newidx;
	// }

	public initCheckBoxes(): void
	{
		const checks = document.querySelectorAll( ".checkbox" );
		let current: HTMLElement = null;


		for( let x = 0; x < checks.length; ++x )
		{
			const check = checks[x] as HTMLElement;
			const input = check.querySelector( "input" ) as HTMLInputElement;
			const span  = check.querySelector( "span" )  as HTMLElement;

			// kliknięcie w kontrolkę spowoduje jej zaznaczenie
			check.addEventListener( "click", (ev: MouseEvent) => {
				const tag = ev.currentTarget as HTMLElement;

				input.focus();
				if( tag.classList.contains("checked") )
				{
					input.checked = false;
					tag.classList.remove( "checked" );
				}
				else
				{
					input.checked = true;
					tag.classList.add( "checked" );
				}

				ev.preventDefault();
				current = null;
			} );
			// wciśnięcie przycisku zaś zapis kontrolki, na której ma być
			// ustawione skupienie
			check.addEventListener( "mousedown", (ev: MouseEvent) => {
				current = ev.currentTarget as HTMLElement;
			} );

			// przy otrzymaniu skupienia dodaj odpowiednią klasę do kontenera
			input.addEventListener( "focus", (ev: FocusEvent) => {
				if( !check.classList.contains("focused") )
					check.classList.add( "focused" );
			} );
			// przy utraceniu skupienia usuń ją
			input.addEventListener( "blur", (ev: FocusEvent) => {
				// sprawdź czy kontrolka która próbuje uzyskać skupienie
				// nie jest czasem tą która to skupienie już posiada...
				if( current != null )
				{
					const input = current.querySelector( "input" );
					if( input == ev.currentTarget )
					{
						ev.preventDefault();
						return;
					}
				}

				if( check.classList.contains("focused") )
					check.classList.remove( "focused" );
			} );
		}
	}
}
