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
 * Klasa kontrolki przycisku wyboru.
 *
 * DESCRIPTION:
 *     Klasa pozwala na rozszerzenie standardowego przycisku wyboru w HTML.
 *     Dzięki temu przycisk wyboru można stylizować dowolnie.
 *     Jedynym wymogiem który należy spełnić tworząc nową kontrolkę jest taki,
 *     aby w kontenerze głównym podawanym do konstruktora znajdował się
 *     oryginalny przycisk wyboru (input o typie checkbox).
 *     Cała reszta dzieje się automatycznie.
 */
class CheckBox
{
	/**
	 * Kontrolka nad którą ustawione jest skupienie po wciśnieciu myszy.
	 * 
	 * TYPE: HTMLElement
	 */
	private static _current: HTMLElement = null;

// =============================================================================

	/**
	 * Oryginalny przycisk wyboru względem którego wyłapywane będzie skupienie.
	 * 
	 * TYPE: HTMLInputElement
	 */
	private _input: HTMLInputElement = null;

	/**
	 * Flaga błędu przetwarzania danych w kontrolce.
	 *
	 * TYPE: boolean
	 */
	private _failed: boolean = false;

	/**
	 * Główny element kontrolki.
	 *
	 * TYPE: HTMLElement
	 */
	private _control: HTMLElement = null;

// =============================================================================

	/**
	 * Konstruktor kontrolki.
	 *
	 * PARAMETERS:
	 *     check: (HTMLElement)
	 *         Element z którego tworzona będzie kontrolka.
	 */
	public constructor( check: HTMLElement )
	{
		this._control = check;
		this._input   = <HTMLInputElement>check.querySelector( "input" );

		// sprawdź czy oryginalny przycisk wyboru został znaleziony
		if( this._input == null )
		{
			this._failed = true;
			return;
		}

		// dodaj klasę do zaznaczonej kontrolki
		if( this._input.checked )
			this._control.classList.add( "checked" );
	}

	/**
	 * Dodaje zdarzenia do kontrolki.
	 *
	 * DESCRIPTION:
	 *     Kontrolka przechwytuje kliknięcie na głównym kontenerze, zaznaczając
	 *     lub odznaczając element.
	 *     Dodatkowo przechwytuje zdarzenia przechwycenia i utraty skupienia
	 *     generowane przez główny przycisk wyboru przypisany do kontrolki.
	 */
	public addEvents(): void
	{
		if( this._failed )
			return;

		// zdarzenia kontenera dla kontrolki
		this._control.addEventListener( "click",     this._onCheckChange );
		this._control.addEventListener( "mousedown", this._onCheckDown   );

		// zdarzenia oryginalnego przycisku wyboru
		this._input.addEventListener( "focus", this._onInputFocus );
		this._input.addEventListener( "blur",  this._onInputBlur  );
	}

// =============================================================================

	/**
	 * Akcja wywoływana po kliknięciu w przycisk wyboru.
	 *
	 * DESCRIPTION:
	 *     Kliknięcie w przycisk wyboru (kontrolkę) powoduje jego zaznaczenie
	 *     lub odznaczenie w zależności od jego aktualnego stanu.
	 *     Zmiana zaznaczenia spowoduje zmianę stanu oryginalnego przycisku
	 *     wyboru przypisanego do kontrolki.
	 * 
	 * PARAMETERS:
	 *     ev: (MouseEvent)
	 *         Argumenty zdarzenia.
	 */
	private _onCheckChange = ( ev: MouseEvent ): void =>
	{
		if( this._failed )
			return;

		this._input.focus();

		// jeżeli wciśnięta została spacja, odwróć wartość
		const selectme = ev.detail === 0
			? !this._input.checked
			: this._input.checked;

		if( selectme )
		{
			this._input.checked = !selectme;
			this._control.classList.remove( "checked" );
		}
		else
		{
			this._input.checked = !selectme;
			this._control.classList.add( "checked" );
		}

		if( ev.detail !== 0 )
			ev.preventDefault();
		CheckBox._current = null;
	}

	/**
	 * Akcja wywoływana po wciśnięciu przycisku myszy na kontrolce.
	 *
	 * DESCRIPTION:
	 *     Wciśnięcie przycisku na kontrolce ustawia na niej skupienie.
	 *     Skupienie tracone jest bezpośrednio gdy kontrolka traci kontakt
	 *     z kursorem po wykryciu kliknięcia.
	 *     Taki kontakt następuje gdy użytkownik klika na kontener aby zaznaczyć
	 *     przycisk (powoduje to ustawienie skupienia na kontenerze).
	 *     Ta część kodu zapobiega temu problemowi.
	 * 
	 * PARAMETERS:
	 *     ev: (MouseEvent)
	 *         Argumenty zdarzenia.
	 */
	private _onCheckDown = ( ev: MouseEvent ): void =>
	{
		if( this._failed )
			return;

		CheckBox._current = this._control;
	}

	/**
	 * Akcja wywoływana po przechwyceniu skupienia przez kontrolkę.
	 *
	 * DESCRIPTION:
	 *     Ustawia odpowiednią klasę kontenerowi, który zawiera kontrolkę
	 *     przechwytującą zdarzenie.
	 *
	 * PARAMETERS:
	 *     ev: (FocusEvent)
	 *         Argumenty zdarzenia.
	 */
	private _onInputFocus = ( ev: FocusEvent ): void =>
	{
		if( this._failed )
			return;

		if( !this._control.classList.contains("focused") )
			this._control.classList.add( "focused" );
	}

	/**
	 * Akcja wywoływana po utraceniu skupienia przez kontrolkę.
	 *
	 * DESCRIPTION:
	 *     Usuwa klasę ustawioną przez funkcję przechwytującą skupienie na
	 *     kontrolce.
	 *     Zabezpiecza przed przypadkową utratą skupienia które występuje po
	 *     kliknięciu w kontener z elementem.
	 *
	 * PARAMETERS:
	 *     ev: (FocusEvent)
	 *         Argumenty zdarzenia.
	 */
	private _onInputBlur = ( ev: FocusEvent ): void =>
	{
		if( this._failed )
			return;

		// sprawdź czy kontrolka nie traci skupienia przez rodzica
		if( CheckBox._current != null )
		{
			const input = CheckBox._current.querySelector( "input" );
			// jeżeli tak, zaniechaj dalszych czynności
			if( input == ev.currentTarget )
			{
				ev.preventDefault();
				return;
			}
		}

		if( this._control.classList.contains("focused") )
			this._control.classList.remove( "focused" );
	}
}
