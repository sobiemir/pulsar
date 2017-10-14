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
	public initTabControls(): void
	{
		// pobierz listę dostępnych przełączników
		const tabs = <NodeListOf<HTMLElement>>
			document.querySelectorAll( ".tab-control" );

		for( let x = 0; x < tabs.length; ++x )
		{
			if( tabs[x].dataset.search === undefined )
				return;

			const tab = new TabControl( tabs[x] );

			// sprawdź która zakładka jest zaznaczona
			const selected = tab.get("tabs").findIdxByFunc( (elem: any) => {
				return elem.classList.contains( "selected" );
			} );

			tab.addEvents();
			tab.selectTab( selected, true );
		}
	}

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
