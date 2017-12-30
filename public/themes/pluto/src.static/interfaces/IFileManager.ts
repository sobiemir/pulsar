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
 * Interfejs zawierający informacje na temat przycisków menedżera plików.
 */
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
	 * Przycisk otwierający panel wgrywania nowego pliku do witryny.
	 *
	 * TYPE: HTMLElement
	 */
	showUploadPanel: HTMLElement;

	/**
	 * Przycisk otwierający panel tworzenia nowego katalogu.
	 *
	 * TYPE: HTMLElement
	 */
	showCreatePanel: HTMLElement;

	/**
	 * Przycisk pozwalający na pobranie pliku.
	 *
	 * TYPE: HTMLAnchorElement
	 */
	download: HTMLAnchorElement;

	/**
	 * Przycisk pozwalający na zmianę nazwy pliku lub katalogu.
	 *
	 * TYPE: HTMLElement
	 */
	rename: HTMLElement;

	/**
	 * Przycisk pozwalający na usunięcie pliku lub katalogu.
	 *
	 * TYPE: HTMLElement
	 */
	remove: HTMLElement;

	/**
	 * Przycisk zamykania podglądu pliku.
	 *
	 * TYPE: HTMLElement
	 */
	closePreview: HTMLElement;

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

	/**
	 * Przycisk pobierania otwartego pliku.
	 *
	 * TYPE: HTMLAnchorElement
	 */
	downloadCurrent: HTMLAnchorElement;

	/**
	 * Przycisk wysyłania żądania dla tworzenia nowego katalogu.
	 *
	 * TYPE: HTMLElement
	 */
	createDirectory: HTMLElement;

	/**
	 * Przycisk wysyłania żądania do wgrania plików.
	 *
	 * TYPE: HTMLElement
	 */
	uploadFile: HTMLElement;
}

// =============================================================================

/**
 * Inferfejs zawierający szczegóły dotyczące wyświetlanego pliku.
 */
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
	 * Informacja o rozmiarze pliku.
	 *
	 * TYPE: HTMLElement
	 */
	size: HTMLElement;
}

// =============================================================================

/**
 * Interfejs zawierający panele używane w menedżerze plików.
 */
interface IFileManagerPanels
{
	/**
	 * Panel wyświetlający drzewo katalogów.
	 * 
	 * TYPE: HTMLElement
	 */
	directories: HTMLElement;

	/**
	 * Panel wyświetlający listę plików.
	 * 
	 * TYPE: HTMLElement
	 */
	entities: HTMLElement;

	/**
	 * Panel wyświetlający szczegóły pliku.
	 * 
	 * TYPE: HTMLElement
	 */
	details: HTMLElement;

	/**
	 * Panel wyświetlający przyciski pod listą plików.
	 * 
	 * TYPE: HTMLElement
	 */
	footer: HTMLElement;

	/**
	 * Panel zawierający kontrolki służące dodawaniu nowego katalogu.
	 * 
	 * TYPE: HTMLElement
	 */
	createDirectory: HTMLElement;

	/**
	 * Panel zawierający kontrolki pozwalające na dodawanie plików.
	 * 
	 * TYPE: HTMLFormElement
	 */
	uploadFile: HTMLFormElement;

	/**
	 * Panel zawierający element wyświetlany podczas wczytywania plików.
	 *
	 * TYPE: HTMLElement
	 */
	entityLoader: HTMLElement;

	/**
	 * Panel zawierający element wyświetlany podczas wczytywania katalogów.
	 *
	 * TYPE: HTMLElement
	 */
	directoryLoader: HTMLElement;

	/**
	 * Panel boczny zawierający drzewo katalogów.
	 *
	 * TYPE: HTMLElement
	 */
	sidebar: HTMLElement;
}

// =============================================================================

/**
 * Interfejs zawierający kontrolki używane w menedżerze plików.
 */
interface IFileManagerControls
{
	/**
	 * Nazwa pliku lub aktualna pozycja użytkownika w drzewie katalogów.
	 *
	 * TYPE: HTMLElement
	 */
	title: HTMLElement;

	/**
	 * Kontrolka wyświetlająca podgląd obrazków.
	 *
	 * TYPE: HTMLImageElement
	 */
	imagePreview: HTMLImageElement;

	/**
	 * Kontrolka wyświetlająca podgląd dla plików.
	 *
	 * TYPE: HTMLTextAreaElement
	 */
	filePreview: HTMLTextAreaElement;

	/**
	 * Nazwa tworzonego obiektu.
	 *
	 * TYPE: HTMLInputElement
	 */
	entityName: HTMLInputElement;

	/**
	 * Kontrolka wyboru plików do wgrywania.
	 *
	 * TYPE: HTMLInputElement
	 */
	uploadFile: HTMLInputElement;

	/**
	 * Lista plików do wgrania wyświetlanych w kontrolce.
	 *
	 * TYPE: HTMLInputElement
	 */
	selectedFiles: HTMLInputElement;
}

// =============================================================================

/**
 * Interfejs zawierający opcje używane podczas inicjalizacji menedżera plików.
 */
interface IFileManagerOptions
{
	/**
	 * Element główny menedżera plików.
	 *
	 * TYPE: HTMLElement
	 */
	element: HTMLElement;

	/**
	 * Selektor względem którego wstawiane będą kolejne elementy w drzewie.
	 *
	 * TYPE: string
	 */
	treeSelector: string;

	/**
	 * Indeks do obiektu posiadającego dzieci.
	 *
	 * TYPE: string
	 */
	childIndex: string;

	/**
	 * Szablon dla pojedynczego katalogu w drzewie.
	 *
	 * TYPE: string | doT.RenderFunction
	 */
	directoryTemplate?: string;

	/**
	 * Szablon dla pojedynczego elementu w liście.
	 *
	 * TYPE: string | doT.RenderFunction
	 */
	entityTemplate?: string;

	actionClasses: {
		showSidebar: string;
		hideSidebar: string;
	};
}
