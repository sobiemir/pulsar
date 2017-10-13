/**
 * IE: 11
 * EDGE: 12
 * FF: 6
 * CHROME: 8
 * SAFARI: 5.1
 * OPERA: 11.5
 */

class Application
{
	public initTabControls(): void
	{
		const tabs = document.querySelectorAll( ".tab-control" );

		for( let x = 0; x < tabs.length; ++x )
		{
			const tab = tabs[x] as HTMLElement;

			if( tab.dataset.searcher == undefined )
				return;

			const searcher = `${tab.dataset.searcher} [data-variant]`;
			const variants = document.querySelectorAll( searcher );

			// brak wyników, leć dalej
			if( variants.length == 0 )
				continue;

			// wybrany wariant
			let idselected = (variants[0] as HTMLElement).dataset.variant;

			// akcja po wciśnięciu jednej z zakładek
			tab.addEventListener( "click", (ev: MouseEvent) => {
				const tag = ev.currentTarget as HTMLElement;

				// jeżeli wciśnięto inny element niż "LI", zakończ funkcję
				if( (ev.target as HTMLElement).tagName != "LI" )
					return;

				// pobierz zaznaczony element i aktualnie kliknięty
				const oldli = tag.querySelector( "li.selected" ) as HTMLElement;
				const newli = ev.target as HTMLElement;

				if( oldli == newli )
					return;

				// zamień klasy zaznaczenia
				oldli.classList.remove( "selected" );
				newli.classList.add( "selected" );

				// pobierz identyfikator przełączające
				const newid = idselected = newli.dataset.id;
				const oldid = oldli.dataset.id;

				// szukaj elementów do przełączenia
				for( let y = 0; y < variants.length; ++y )
				{
					const variant = variants[y] as HTMLElement;

					// gdy element zostanie znaleziony, zmień jego widoczność
					if( variant.dataset.variant == newid )
						variant.classList.remove( "hidden" );
					else if( variant.dataset.variant == oldid )
						variant.classList.add( "hidden" );
				}
			} );

			// usuwanie danych znajdujących się w aktywnej zakładce
			if( tab.dataset.remover != undefined )
			{

			}
			// dodawanie danych do aktywnej zakładki
			if( tab.dataset.creator != undefined )
			{
				
			}
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

document.addEventListener( "DOMContentLoaded", () => {
	const app = new Application();

	app.initTabControls();
	app.initCheckBoxes();
} );
