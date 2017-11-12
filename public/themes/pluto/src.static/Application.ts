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
 * Wymagania przeglądarkowe dla statycznej wersji strony:
 *
 * IE:     11
 * EDGE:   12
 * FF:     6
 * CHROME: 8
 * SAFARI: 5.1
 * OPERA:  11.5
 */
class Application
{
	/**
	 * Konstruktor klasy.
	 */
	public constructor()
	{
		this.initCheckBoxes();
		this.initTabControls();
		this.initConfirmMessages();
	}

	/**
	 * Podpina akcje pod znalezione kontrolki zakładek.
	 */
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

	/**
	 * Podpina akcje pod znalezione przyciski wyboru.
	 */
	public initCheckBoxes(): void
	{
		const checks = <NodeListOf<HTMLElement>>
			document.querySelectorAll( ".checkbox" );

		for( let x = 0; x < checks.length; ++x )
		{
			const check = new CheckBox( checks[x] );
			check.addEvents();
		}
	}

	/**
	 * Podpina akcje pod znaleziony element menedżera plików.
	 */
	public initFileManager(): void
	{
		// const fmgrdiv = <HTMLElement>document.querySelector( ".filemanager" );

		// if( fmgrdiv == null )
		// 	return;

		// const filemanager = new FileManager( fmgrdiv );
		// filemanager.addEvents();
	}

	/**
	 * Podpina pod elementy akcję wyświetlającą pytanie użytkownikowi.
	 *
	 * DESCRIPTION:
	 *     Wyszukuje wszystkie elementy z klasą 'show-confirm' i podpina pod nie
	 *     funkcję uruchamianą po kliknięciu myszą w wybrany element.
	 *     Kliknięcie myszą powoduje wyświetlenie pytania z treścią zapisaną
	 *     w atrybucie 'data-confirm'.
	 *     W przypadku gdy użytkownik odpowie zaznaczy negatywną odpowiedź,
	 *     dalsze działanie elementów przycisku jest przerywane.
	 */
	public initConfirmMessages(): void
	{
		const confirms = <NodeListOf<HTMLElement>>
			document.querySelectorAll( ".show-confirm" );

		for( let x = 0; x < confirms.length; ++x )
		{
			if( !("confirm" in confirms[x].dataset) )
				continue;

			confirms[x].addEventListener( "click", (ev: MouseEvent) => {

				if( confirm(confirms[x].dataset.confirm) )
					return true;

				ev.stopPropagation();
				ev.preventDefault();
				return false;
			} );
		}
	}
}

// Uruchom klasę po załadowaniu dokumentu
document.addEventListener( "DOMContentLoaded", () => {
	new Application();
} );
