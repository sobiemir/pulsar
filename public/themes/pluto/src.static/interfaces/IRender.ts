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
 * Interfejs zawierający dodatkowe dane dla renderowanego drzewa elementów.
 *
 * DESCRIPTION:
 *     Interfejs ten używany jest przy konwersji z wartości "any".
 *     Wartości przypisywane są w polu "extra", które znajduje się w interfejsie
 *     o nazwie IObservableValue.
 */
interface IRenderTreeExtra<TYPE>
{
	/**
	 * Klasa nadrzędna (rodzic), zawierająca listę elementów.
	 * 
	 * TYPE: RenderArrayTree<TYPE>
	 */
	owner?: RenderArrayTree<TYPE>;

	/**
	 * Klasa podrzędna (dziecko), zawierająca listę elementów.
	 * 
	 * TYPE: RenderArrayTree<TYPE>
	 */
	child?: RenderArrayTree<TYPE>;
}

// =============================================================================

/**
 * Interfejs zawierający opcje możliwe do ustawienia dla klasy RenderArray.
 */
interface IRenderArrayOptions
{
	/**
	 * Czy szablon ma być generowany osobno dla każdego elementu czy w całości.
	 *
	 * TYPE: boolean
	 */
	single?: boolean;

	/**
	 * Szablon z którego generowane będą elementy lub całość.
	 *
	 * DESCRIPTION:
	 *     Od tego czy szablon będzie renderowany osobno dla każdego elementu
	 *     czy w całości zależy ustawienie pola "single".
	 *     Wartością tego pola może być szablon który będzie kompilowany dopiero
	 *     podczas ustawiania opcji lub funkcja reprezentująca wygenerowany
	 *     szablon.
	 * 
	 * TYPE: string | doT.RenderFunction
	 */
	template?: string | doT.RenderFunction;

	/**
	 * Element do którego wrzucany będzie szablon.
	 * 
	 * TYPE: HTMLElement
	 */
	place?: HTMLElement;

	/**
	 * Obiekt główny używany w zasięgu kompilowanego szablonu.
	 *
	 * TYPE: any
	 */
	callObject?: any;
}

// =============================================================================

/**
 * Interfejs zawierający opcje możliwe do ustawienia dla klasy RenderArrayTree.
 */
interface IRenderArrayTreeOptions
{
	/**
	 * Selektor wybierający elementy do których mają być renderowane szablony.
	 *
	 * TYPE: string
	 */
	treeSelector?: string;

	/**
	 * Szablon z którego generowane będą elementy lub całość.
	 *
	 * DESCRIPTION:
	 *     Od tego czy szablon będzie renderowany osobno dla każdego elementu
	 *     czy w całości zależy ustawienie pola "single".
	 *     Wartością tego pola może być szablon który będzie kompilowany dopiero
	 *     podczas ustawiania opcji lub funkcja reprezentująca wygenerowany
	 *     szablon.
	 * 
	 * TYPE: string | doT.RenderFunction
	 */
	template?: string | doT.RenderFunction;

	/**
	 * Element do którego wrzucany będzie szablon.
	 * 
	 * TYPE: HTMLElement
	 */
	place?: HTMLElement;

	/**
	 * Nazwa pola zawierającego listę dzieci w oryginalnym obiekcie.
	 *
	 * TYPE: string
	 */
	childIndex?: string;

	/**
	 * Obiekt główny używany w zasięgu kompilowanego szablonu.
	 *
	 * TYPE: any
	 */
	callObject?: any;
}
