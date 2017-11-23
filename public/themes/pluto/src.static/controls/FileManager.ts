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

class FileManager
{
	/**
	 * Główny element na którym opiera się menedżer plików.
	 *
	 * TYPE: HTMLElement
	 */
	private _fileManager: HTMLElement = null;

	/**
	 * Panel zawierający listę folderów.
	 *
	 * TYPE: HTMLElement
	 */
	private _directoryPanel: HTMLElement = null;

	/**
	 * Lista folderów w postaci obserwowanej renderowanej tablicy drzewa.
	 *
	 * TYPE: RenderArrayTree<IFolder>
	 */
	private _directories: RenderArrayTree<IFolder> = null;

	/**
	 * Lista elementów w folderze w postaci obserwowanej renderowanej tablicy.
	 * 
	 * TYPE: RenderArray<IEntity>
	 */
	private _entities: RenderArray<IEntity> = null;

	/**
	 * Panel zawierający listę elementów w folderze.
	 *
	 * TYPE: HTMLElement
	 */
	private _entityPanel: HTMLElement = null;

	/**
	 * Szablon pojedynczego elementu w prawym panelu.
	 *
	 * TYPE: string
	 */
	private _entityTemplate: string = '';

	/**
	 * Szablon pojedynczego elementu w lewym panelu.
	 *
	 * TYPE: string
	 */
	private _directoryTemplate: string = '';

	/**
	 * Element w którym wyświetlana będzie aktualna ścieżka.
	 *
	 * TYPE: HTMLElement
	 */
	private _title: HTMLElement = null;

	/**
	 * Element wczytywania danych po stronie panelu z folderami.
	 *
	 * TYPE: HTMLElement
	 */
	private _directoryLoader: HTMLElement = null;

	/**
	 * Element wczytywania danych po stronie panelu z danymi.
	 *
	 * TYPE: HTMLElement
	 */
	private _entityLoader: HTMLElement = null;

	/**
	 * Przycisk odświeżania struktury folderów.
	 *
	 * TYPE: HTMLElement
	 */
	private _refreshButton: HTMLElement = null;

	/**
	 * Przycisk przejścia do katalogu w górę.
	 *
	 * TYPE: HTMLElement
	 */
	private _upButton: HTMLElement = null;

	/**
	 * Aktualnie zaznaczony element w panelu z drzewem folderów.
	 *
	 * TYPE: HTMLElement
	 */
	private _currentElement: HTMLElement = null;

	/**
	 * Aktualnie zaznaczony folder z obserwowaną wartością.
	 * 
	 * TYPE: IObservableValue<IFolder>
	 */
	private _currentObservable: IObservableValue<IFolder> = null;

	/**
	 * Przycisk powracający na widok głównego katalogu w prawym panelu.
	 *
	 * TYPE: HTMLElement
	 */
	private _homeButton: HTMLElement = null;

// =============================================================================

	/**
	 * Konstruktor kontrolki.
	 *
	 * PARAMETERS:
	 *     tab: (HTMLElement)
	 *         Główny element na którym opiera się menedżer plików.
	 */
	public constructor( div: HTMLElement )
	{
		this._directories = new RenderArrayTree();
		this._entities    = new RenderArray();
		this._fileManager = div;

		this._directoryPanel =
			this._fileManager.$<HTMLElement>( ".directory-tree" );
		this._entityPanel =
			this._fileManager.$<HTMLElement>( ".entities-list" );
		this._homeButton =
			this._fileManager.$<HTMLElement>( "#FM_Home" );
		this._refreshButton =
			this._fileManager.$<HTMLElement>( "#FM_Refresh" );
		this._title =
			this._fileManager.$<HTMLElement>( ".breadcrumb p" );
		this._directoryLoader =
			this._fileManager.$<HTMLElement>( "#FM_DirectoryLoad" );
		this._entityLoader =
			this._fileManager.$<HTMLElement>( "#FM_EntityLoad" );
		this._upButton =
			this._fileManager.$<HTMLElement>( "#FM_GoUp" );

		// szablon dla elementu wyświetlanego w prawym panelu
		const etpl = this._fileManager.$( "#tpl-entity-item" );
		this._entityTemplate = etpl
			? etpl.innerHTML
			: '';
		// szablon dla elementu wyświetlanego w lewym panelu
		const dtpl = this._fileManager.$( "#tpl-directory-item" );
		this._directoryTemplate = dtpl
			? dtpl.innerHTML
			: '';

		this._directories.options({
			treeSelector: ".directory-subtree",
			childIndex: "children",
			template: this._directoryTemplate,
			place: this._directoryPanel
		});

		// zdarzenia i subskrypcje
		this._addEvents();
		this._addSubscriptions();

		// opcje renderowanych elementów
		this._entities.options({
			single: false,
			template: this._entityTemplate,
			place: this._entityPanel,
			callObject: this
		});

		this.getFolders();
		this.getEntities();
	}

	/**
	 * Pobiera wartość parametru o podanym indeksie.
	 *
	 * PARAMETERS:
	 *     index: (string)
	 *         Indeks z którego wartość parametru ma zostać pobrana.
	 *
	 * RETURNS: (any)
	 *     Wartość parametru o podanym indeksie.
	 */
	public get( index: string ): any
	{
		const name = `_${index}`;

		if( name in this )
			return (<any>this)[name];

		return null;
	}

	/**
	 * Zamienia jednostkę rozmiaru pliku na największą z możliwych do użycia.
	 *
	 * PARAMETERS:
	 *     bytes: number
	 *         Rozmiar pliku.
	 *
	 * RETURNS: string
	 *     Rozmiar pliku liczony w największej możliwej jednostce.
	 */
	public humanReadableSize( bytes: number ): string
	{
		const sizes = ['B', 'KiB', 'MiB', 'GiB'];

		if( !bytes )
			return '0 B';
		const index = ~~Math.floor( Math.log(bytes) / Math.log(1024) );

		if( !index )
			return `${bytes} ${sizes[index]})`;

		return `${(bytes / (1024 ** index)).toFixed(2)} ${sizes[index]}`;
	}

	/**
	 * Pobiera ścieżkę z podanego folderu.
	 *
	 * PARAMETERS:
	 *     elem: IObservableValue<IFolder>
	 *         Element z którego ścieżka będzie wnioskowana.
	 *     path: string
	 *         Ścieżka do dodania na koniec.
	 *
	 * RETURNS: string
	 *     Wywnioskowana ścieżka z elementu.
	 */
	public getPath( elem: IObservableValue<IFolder>, path: string = "" ): string
	{
		if( elem.extra.owner.getUpper() )
			return this.getPath(
				elem.extra.owner.getUpper(),
				`${elem.value.name}/${path}`
			);
		return `${elem.value.name}/${path}`;
	}

	/**
	 * Wysyła żądanie do serwera o drzewo folderów.
	 *
	 * RETURNS: Qwest.Promise
	 *     Obiekt oczekujący na wykonanie zapytania.
	 */
	public getFolders(): Qwest.Promise
	{
		this._directoryLoader.classList.remove( "hidden" );

		return qwest.post( "/micro/filemanager/directories", {
			path: '/',
			recursive: 1
		} ).then( (xhr: XMLHttpRequest, response?: IFolder[]): any => {
			const noroll = (val: IFolder): void =>
			{
				val.rolled = true;
				if( val.children && val.children.length )
					val.children.forEach( noroll );
			};
			response.forEach( noroll );

			response.deepSort( (a, b) => {
				return a.name.localeCompare( b.name );
			}, "children" );

			this._directories.set( response );

			this._directoryLoader.classList.add( "hidden" );
		} ).catch( (error: Error, xhr?: XMLHttpRequest): any => {
			this._onLoadError( error, xhr );
		} );
	}

	/**
	 * Wysyła żądanie do serwera o listę elementów w folderze.
	 *
	 * PARAMETERS:
	 *     folder: string
	 *         Folder z którego elementy mają być pobierane.
	 * 
	 * RETURNS: Qwest.Promise
	 *     Obiekt oczekujący na wykonanie zapytania.
	 */
	public getEntities( folder: string = '/' ): Qwest.Promise
	{
		this._entityLoader.classList.remove( "hidden" );

		return qwest.post( "/micro/filemanager/entities", {
			path: folder
		} ).then( (xhr: XMLHttpRequest, response?: IEntity[]): any =>
		{
			response.sort( (a, b) =>
			{
				const ret = a.name.localeCompare( b.name );

				if( a.type === b.type )
					return ret;
				else if( a.type === "dir" )
					return -1;
				else if( b.type === "dir" )
					return 1;

				return ret;
			} );

			this._entities.set( response );

			this._entityLoader.classList.add( "hidden" );
		} ).catch( (error: Error, xhr?: XMLHttpRequest): any =>
		{
			this._onLoadError( error, xhr );
		} );
	}

// =============================================================================

	/**
	 * Akcja wywoływana po kliknięciu w folder z lewego panelu.
	 *
	 * PARAMETERS:
	 *     element: HTMLElement
	 *         Kliknięty element w drzewie.
	 *     observable: IObservableValue<IFolder>
	 *         Zmienna zawierająca dane na temat katalogu.
	 *     ev: MouseEvent
	 *         Argumenty zdarzenia.
	 */
	private _browseFolder(
		element:    HTMLElement,
		observable: IObservableValue<IFolder>,
		ev:         MouseEvent
	): void
	{
		// jeżeli został zaznaczony już folder, odznacz go
		if( this._currentElement )
			this._currentElement.classList.remove( "selected" );

		// zapisz kliknięty element
		this._currentElement = observable
			? <HTMLElement>observable.element.firstChild
			: null;
		this._currentObservable = observable;

		// wypisz aktualną ścieżkę i pobierz zawartość
		if( this._currentElement )
		{
			this._currentElement.classList.add( "selected" );

			const path = this.getPath( observable );
			this.getEntities( path );

			this._title.classList.remove( "root" );
			this._title.innerHTML = `/${path}`;
		}
		// gdy brak aktualnego elementu, pobierz zawartość głównego folderu
		else
		{
			this._title.classList.add( "root" );
			this._title.innerHTML = "Pulsar";
		}
	}

	/**
	 * Akcja wywoływana podczas kliknięcia w ikonę rozwijania folderów.
	 *
	 * PARAMETERS:
	 *     element: HTMLElement
	 *         Kliknięty element w drzewie.
	 *     observable: IObservableValue<IFolder>
	 *         Zmienna zawierająca dane na temat katalogu.
	 *     ev: MouseEvent
	 *         Argumenty zdarzenia.
	 */
	private _toggleFolderTree(
		element:    HTMLElement,
		observable: IObservableValue<IFolder>,
		ev:         MouseEvent
	): void
	{
		const last   = <HTMLElement>observable.element.lastChild;
		const folder = <HTMLElement>element.parentNode.childNodes[1];

		// zmień na odpowiednią klasę
		if( observable.value.rolled )
		{
			last.classList.remove( "hidden" );
			element.classList.remove( "fa-angle-right" );
			element.classList.add( "fa-angle-down" );
			folder.classList.remove( "fa-folder" );
			folder.classList.add( "fa-folder-open" );
		}
		else
		{
			last.classList.add( "hidden" );
			element.classList.remove( "fa-angle-down" );
			element.classList.add( "fa-angle-right" );
			folder.classList.remove( "fa-folder-open" );
			folder.classList.add( "fa-folder" );
		}
		observable.value.rolled = !observable.value.rolled;

		// nie otwieraj folderu po rozwinięciu
		ev.stopPropagation();
	}

	/**
	 * Dodaje zdarzenia do kontrolki.
	 */
	private _addEvents(): void
	{
		// przejście do głównego folderu
		this._homeButton.addEventListener( "click", () => {
			this.getEntities( "/" );
			this._browseFolder( null, null, null );
		} );
		// odświeżenie folderów
		this._refreshButton.addEventListener( "click", () => {
			this.getFolders();
			this.getEntities( "/" );

			this._browseFolder( null, null, null );
		} );
		// przejście o jeden folder do góry
		this._upButton.addEventListener( "click", () => {
			if( !this._currentObservable )
				return;
			if( !this._currentObservable.extra.owner.getUpper() )
			{
				this._browseFolder( null, null, null );
				this.getEntities( "/" );
				return;
			}

			const upper = <IObservableValue<IFolder>>
				this._currentObservable.extra.owner.getUpper();

			this._browseFolder(
				<HTMLElement>upper.element.firstChild,
				upper,
				null
			);
		} );
	}

	/**
	 * Dodaje subskrypcje do obserwowanych wartości.
	 */
	private _addSubscriptions(): void
	{
		this._directories.subscribe( obs =>
		{
			const observables = obs.getObservables();

			for( const observable of observables )
			{
				if( !observable.wasUpdated )
					continue;

				const first = <HTMLElement>observable.element.firstChild;

				first.$$<HTMLElement>( "[data-click]" ).forEach( val => {
					if( val.dataset.click == "toggle" )
						val.addEventListener( "click", (ev: MouseEvent) => {
							this._toggleFolderTree( val, observable, ev );
						} );
					else if( val.dataset.click == "browse" )
						val.addEventListener( "click", (ev: MouseEvent) => {
							this._browseFolder( val, observable, ev );
						} );
				} );
			}
		}, "click" );
	}

	/**
	 * Funkcja wywoływana podczas błędu w zapytaniu.
	 *
	 * PARAMETERS:
	 *     error: Error
	 *         Zawartość wyjątku.
	 *     xml: XMLHttpRequest
	 *         Informacje o zwracanych danych po zapytaniu.
	 */
	private _onLoadError = ( error: Error, xml: XMLHttpRequest ): void =>
	{
		console.log( error );
	}
}
