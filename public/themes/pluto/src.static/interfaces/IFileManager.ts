
interface IFileManagerButtons
{
	/**
	 * Przycisk do przechodzenia w górę w drzewie katalogów.
	 *
	 * TYPE: HTMLElement
	 */
	up: HTMLElement;

	/**
	 * Przycisk powrotu do głównego katalogu.
	 *
	 * TYPE: HTMLElement
	 */
	home: HTMLElement;

	/**
	 * Przycisk odświeżania listy.
	 *
	 * TYPE: HTMLElement
	 */
	refresh: HTMLElement;

	/**
	 * Przycisk przełączania drzewa z katalogami (lewy panel).
	 *
	 * TYPE: HTMLElement
	 */
	toggleTree: HTMLElement;

	/**
	 * Przycisk wgrywania nowego pliku do witryny.
	 *
	 * TYPE: HTMLElement
	 */
	upload: HTMLElement;

	/**
	 * Przycisk tworzenia nowego folderu.
	 *
	 * TYPE: HTMLElement
	 */
	newFolder: HTMLElement;

	/**
	 * Przycisk otwierający szczegóły pliku.
	 *
	 * TYPE: HTMLElement
	 */
	details: HTMLElement;

	/**
	 * Przycisk pozwalający na pobranie pliku.
	 *
	 * TYPE: HTMLElement
	 */
	download: HTMLAnchorElement;

	/**
	 * Przycisk pozwalający na zmianę nazwy pliku lub folderu.
	 *
	 * TYPE: HTMLElement
	 */
	rename: HTMLElement;

	/**
	 * Przycisk pozwalający na usunięcie pliku lub folderu.
	 *
	 * TYPE: HTMLElement
	 */
	remove: HTMLElement;

	/**
	 * Przycisk zamykania panelu informacji na temat pliku.
	 *
	 * TYPE: HTMLElement
	 */
	closeInfo: HTMLElement;

	/**
	 * Przycisk wyszukiwania elementu...
	 *
	 * TYPE: HTMLElement
	 */
	search: HTMLElement;

	/**
	 * Przycisk przewijania do następnego pliku.
	 *
	 * TYPE: HTMLElement
	 */
	nextFile: HTMLElement;

	/**
	 * Przycisk przewijania do poprzedniego pliku.
	 *
	 * TYPE: HTMLElement
	 */
	prevFile: HTMLElement;

	getOpened: HTMLAnchorElement;
}

interface IFileManagerDetails
{
	/**
	 * Nazwa pliku wyświetlana w szczegółach.
	 * 
	 * TYPE: HTMLElement
	 */
	name: HTMLElement;

	/**
	 * Informacja o wymiarach pliku.
	 *
	 * TYPE: HTMLElement
	 */
	dimension: HTMLElement;

	/**
	 * Element do wyświetlania typu pliku.
	 *
	 * TYPE: HTMLElement
	 */
	type: HTMLElement;

	/**
	 * Informacja o ostatniej modyfikacji pliku.
	 *
	 * TYPE: HTMLElement
	 */
	modified: HTMLElement;

	/**
	 * Informacja o wymiarach pliku.
	 *
	 * TYPE: HTMLElement
	 */
	size: HTMLElement;
}
