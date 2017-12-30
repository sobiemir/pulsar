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

// wyrażenia regularne używane przy parsowaniu szablonów w bibliotece doT
const doTRegex = [
	/\<\%([\s\S]+?)\%\>/g,
	/\<\%=([\s\S]+?)\%\>/g,
	/\<\%!([\s\S]+?)\%\>/g,
	/\<\%#([\s\S]+?)\%\>/g,
	/\<\%##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\%\>/g,
	/\<\%\?(\?)?\s*([\s\S]*?)\s*\%\>/g,
	/\<\%~\s*(?:\%\>|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\%\>)/g
];

// =============================================================================

/**
 * Klasa główna aplikacji.
 *
 * DESCRIPTION:
 *     Inicjalizuje elementy które wymagają obsługi JavaScript do działania.
 *     Są to między innymi: kontrolki zakładek, przyciski zaznaczania czy
 *     menedżer plików.
 *     Wszystkie z nich są inicjalizowane w odpowiednich funkcjach umieszczonych
 *     w tej klasie.
 */
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
		const tabs = $$<HTMLElement>(".tab-control");

		if( !tabs || tabs.length == 0 )
			return;

		Logger.Debug(
			"init",
			`Creating tab controls, total: ${tabs.length}`
		);
		tabs.forEach( elem =>
		{
			const tab = new TabControl( elem );

			if( !tab )
				return;

			// sprawdź która zakładka jest zaznaczona
			const selected = tab.get("tabs").findIndex( (elem: any) =>
				elem.classList.contains("selected")
			);

			tab.selectTab( selected, true );
		} );
	}

	/**
	 * Podpina akcje pod znalezione przyciski wyboru.
	 */
	public initCheckBoxes(): void
	{
		const checkboxes = $$<HTMLElement>(".checkbox");

		if( !checkboxes || checkboxes.length == 0 )
			return;

		Logger.Debug(
			"init",
			`Creating checkboxes, total: ${checkboxes.length}`
		);
		checkboxes.forEach( elem => new CheckBox(elem) );
	}

	/**
	 * Podpina akcje pod znaleziony element menedżera plików.
	 *
	 * DESCRIPTION:
	 *     Menedżer plików powinien być tylko jeden.
	 *     Po inicjalizacji powinien być odpowiednio podpinany w miejsce gdzie
	 *     użytkownik chce móc wybierać pliki lub je przeglądać i wgrywać.
	 *     Szczegóły dotyczące inicjalizacji menedżera plików znajdują się
	 *     w klasie FileManager.
	 */
	public initFileManager(): void
	{
		const fmgrdiv = $<HTMLElement>("#filemanager");

		if( !fmgrdiv )
			return;

		Logger.Debug( "init", "Creating filemanager instance" );

		new FileManager( {
			element:      fmgrdiv,
			treeSelector: ".directory-subtree",
			childIndex:   "children",
			actionClasses: {
				showSidebar: "fa-arrow-circle-o-left",
				hideSidebar: "fa-arrow-circle-o-right"
			}
		} );
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
		const messages = $$<HTMLElement>(".show-confirm");

		if( !messages || messages.length == 0 )
			return;

		Logger.Debug(
			"init",
			`Initializing confirms, total: ${messages.length}`
		);

		messages.forEach( elem =>
		{
			// znacznik musi posiadać atrybut zawierający wyświetlaną wiadomość
			if( !("confirm" in elem.dataset) )
			{
				Logger.Warning(
					"init",
					"Missing 'data-confirm' attribute in confirm"
				);
				return;
			}

			// akcja wywoływana po kliknięciu w element
			elem.addEventListener( "click", (ev: MouseEvent) =>
			{
				if( confirm(elem.dataset.confirm) )
				{
					Logger.Info( "confirm", "Question was accepted" );
					return true;
				}

				Logger.Info( "confirm", "Question was rejected" );

				ev.stopPropagation();
				ev.preventDefault();
				return false;
			} );
		} );
	}
}

// =============================================================================

// przygotuj aplikacje do działania dopiero po załadowaniu całego dokumentu
document.addEventListener( "DOMContentLoaded", () =>
{
	const app = new Application();

	app.initCheckBoxes();
	app.initConfirmMessages();
	app.initTabControls();
	app.initFileManager();
} );
