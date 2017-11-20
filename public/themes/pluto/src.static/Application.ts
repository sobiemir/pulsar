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

const doTRegex = [
	/\<\%([\s\S]+?)\%\>/g,
	/\<\%=([\s\S]+?)\%\>/g,
	/\<\%!([\s\S]+?)\%\>/g,
	/\<\%#([\s\S]+?)\%\>/g,
	/\<\%##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\%\>/g,
	/\<\%\?(\?)?\s*([\s\S]*?)\s*\%\>/g,
	/\<\%~\s*(?:\%\>|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\%\>)/g
];

class Application
{
	/**
	 * Konstruktor klasy.
	 */
	public constructor()
	{
		// biblioteka doT jest wczytywana tylko gdy istnieje menedżer plików
		try
		{
			doT.templateSettings.evaluate    = doTRegex[0];
			doT.templateSettings.interpolate = doTRegex[1];
			doT.templateSettings.encode      = doTRegex[2];
			doT.templateSettings.use         = doTRegex[3];
			doT.templateSettings.define      = doTRegex[4];
			doT.templateSettings.conditional = doTRegex[5];
			doT.templateSettings.iterate     = doTRegex[6];
		}
		// w każdym razie brak zmiennej doT nie jest błędem
		catch( ex ) {}
	}

	/**
	 * Podpina akcje pod znalezione kontrolki zakładek.
	 */
	public initTabControls(): void
	{
		$$<HTMLElement>( ".tab-control" ).forEach( elem =>
		{
			if( !elem.dataset.search )
				return;

			const tab = new TabControl( elem );

			// sprawdź która zakładka jest zaznaczona
			const selected = tab.get("tabs").findIndex( (elem: any) => {
				return elem.classList.contains( "selected" );
			} );

			tab.addEvents();
			tab.selectTab( selected, true );
		} );
	}

	/**
	 * Podpina akcje pod znalezione przyciski wyboru.
	 */
	public initCheckBoxes(): void
	{
		$$<HTMLElement>( ".checkbox" ).forEach( elem =>
		{
			const check = new CheckBox( elem );
			check.addEvents();
		} );
	}

	/**
	 * Podpina akcje pod znaleziony element menedżera plików.
	 */
	public initFileManager(): void
	{
		const fmgrdiv = $<HTMLElement>( ".filemanager" );

		if( !fmgrdiv )
			return;

		const filemanager = new FileManager( fmgrdiv );
		filemanager.addEvents();
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
		$$<HTMLElement>( ".show-confirm" ).forEach( elem =>
		{
			if( !("confirm" in elem.dataset) )
				return;

			elem.addEventListener( "click", (ev: MouseEvent) =>
			{
				if( confirm(elem.dataset.confirm) )
					return true;

				ev.stopPropagation();
				ev.preventDefault();
				return false;
			} );
		} );
	}
}

// =============================================================================

document.addEventListener( "DOMContentLoaded", () =>
{
	const app = new Application();

	app.initCheckBoxes();
	app.initConfirmMessages();
	app.initTabControls();
	app.initFileManager();
} );
