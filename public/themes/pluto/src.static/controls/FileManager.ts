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
	 * Lista przycisków znajdujących się w menedżerze plików.
	 *
	 * TYPE: IFileManagerButtons
	 */
	private _buttons: IFileManagerButtons;

	/**
	 * Główny element na którym opiera się menedżer plików.
	 *
	 * TYPE: HTMLElement
	 */
	private _fileManager: HTMLElement;

	/**
	 * Szczegóły o pliku otwierane po dwukrotnym kliknięciu na niego.
	 *
	 * TYPE: HTMLElement
	 */
	private _detailsPanel: HTMLElement;

	/**
	 * Panel zawierający akcję dla plików i folderów.
	 *
	 * TYPE: HTMLElement
	 */
	private _footerPanel: HTMLElement;

	/**
	 * Panel zawierający listę folderów.
	 *
	 * TYPE: HTMLElement
	 */
	private _directoryPanel: HTMLElement;

	/**
	 * Lista folderów w postaci obserwowanej renderowanej tablicy drzewa.
	 *
	 * TYPE: RenderArrayTree<IFolder>
	 */
	private _directories: RenderArrayTree<IFolder>;

	/**
	 * Lista elementów w folderze w postaci obserwowanej renderowanej tablicy.
	 * 
	 * TYPE: RenderArray<IEntity>
	 */
	private _entities: RenderArray<IEntity>;

	/**
	 * Panel zawierający listę elementów w folderze.
	 *
	 * TYPE: HTMLElement
	 */
	private _entityPanel: HTMLElement;

	/**
	 * Szablon pojedynczego elementu w prawym panelu.
	 *
	 * TYPE: string
	 */
	private _entityTemplate: string;

	/**
	 * Szablon pojedynczego elementu w lewym panelu.
	 *
	 * TYPE: string
	 */
	private _directoryTemplate: string;

	/**
	 * Element w którym wyświetlana będzie aktualna ścieżka.
	 *
	 * TYPE: HTMLElement
	 */
	private _title: HTMLElement;

	/**
	 * Element wczytywania danych po stronie panelu z folderami.
	 *
	 * TYPE: HTMLElement
	 */
	private _directoryLoader: HTMLElement;

	/**
	 * Element wczytywania danych po stronie panelu z danymi.
	 *
	 * TYPE: HTMLElement
	 */
	private _entityLoader: HTMLElement;

	/**
	 * Aktualnie zaznaczony element w panelu z drzewem folderów.
	 *
	 * TYPE: HTMLElement
	 */
	private _currentElement: HTMLElement;

	/**
	 * Aktualnie zaznaczony folder z obserwowaną wartością.
	 * 
	 * TYPE: IObservableValue<IFolder>
	 */
	private _currentObservable: IObservableValue<IFolder>;

	/**
	 * Aktualny obiekt zaznaczony w prawym panelu.
	 *
	 * TYPE: HTMLElement
	 */
	private _currentEntity: HTMLElement;

	/**
	 * Aktualnie otwarty plik.
	 *
	 * TYPE: IObservableValue<IEntity>
	 */
	private _openedFile: IObservableValue<IEntity>;

	/**
	 * Panel boczny menedżera plików zawierający listę folderów.
	 *
	 * TYPE: HTMLElement
	 */
	private _sidebar: HTMLElement;

	/**
	 * Kontrolka do poglądu obrazków.
	 *
	 * TYPE: HTMLImageElement
	 */
	private _imgPreview: HTMLImageElement;

	/**
	 * Kontrolka do podglądu zawartości plików.
	 *
	 * TYPE: HTMLTextAreaElement
	 */
	private _filePreview: HTMLTextAreaElement;

	/**
	 * Elementy do których zapisywane będą szczegóły pliku.
	 *
	 * TYPE: IFileManagerDetails
	 */
	private _details: IFileManagerDetails;

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

		// przygotuj elementy menedżera
		this._prepareElements();

		this._directories.options({
			treeSelector: ".directory-subtree",
			childIndex:   "children",
			template:     this._directoryTemplate,
			place:        this._directoryPanel
		});

		// zdarzenia i subskrypcje
		this._addEvents();
		this._addSubscriptions();

		// opcje renderowanych elementów
		this._entities.options({
			single:     false,
			template:   this._entityTemplate,
			place:      this._entityPanel,
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
		if( !elem )
			return path;

		if( elem.extra.owner.getUpper() )
			return this.getPath(
				elem.extra.owner.getUpper(),
				`${elem.value.name}/${path}`
			);
		return `${elem.value.name}/${path}`;
	}

	/**
	 * Rozwija drzewo do podanego elementu.
	 *
	 * PARAMETERS:
	 *     elem: IObservableValue<IFolder>
	 *         Element od którego ma się rozpocząć rozwijanie w górę.
	 */
	public rollDownToElem( elem: IObservableValue<IFolder> ): void
	{
		// sprawdź czy drzewo w elemencie jest rozwinięte czy nie
		if( elem.value.rolled )
		{
			// jeżeli nie, rozwiń go
			const toggle = elem.element.$<HTMLElement>( "[data-click=toggle]" );

			if( toggle != null )
				this._toggleFolderTree(
					toggle,
					elem,
					null
				);
		}

		// sprawdź czy istnieje rozdzic, który może być rozwinięty
		const extra = <IRenderTreeExtra<IFolder>>elem.extra;
		const upper = extra.owner.getUpper();

		if( !upper )
			return;

		// jeżeli tak, wywołaj samą siebie aby go rozwinąć
		this.rollDownToElem( upper );
	}

	/**
	 * Wysyła żądanie do serwera o drzewo folderów.
	 *
	 * RETURNS: Qwest.Promise
	 *     Obiekt oczekujący na wykonanie zapytania.
	 */
	public getFolders(): Qwest.Promise
	{
		// pokaż panel ładowania
		this._directoryLoader.classList.remove( "hidden" );

		// wyślij żądanie o listę katalogów
		return qwest.post( "/micro/filemanager/directories",
		{
			path: '/',
			recursive: 1
		} ).then( (xhr: XMLHttpRequest, response?: IFolder[]): any =>
		{
			// zwiń wszystkie elementy
			const rolled = (val: IFolder): void =>
			{
				val.rolled = true;
				if( val.children && val.children.length )
					val.children.forEach( rolled );
			};
			response.forEach( rolled );

			// posortuj względem nazwy całe drzewo
			response.deepSort( (a, b) => {
				return a.name.localeCompare( b.name );
			}, "children" );

			this._directories.set( response );

			// i schowaj panel ładowania
			this._directoryLoader.classList.add( "hidden" );
		} ).catch( (error: Error, xhr?: XMLHttpRequest): any =>
		{
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
		// pokaż panel ładowania
		this._entityLoader.classList.remove( "hidden" );

		// wyślij żądanie o listę plików w katalogu
		return qwest.post( "/micro/filemanager/entities",
		{
			path: folder
		} ).then( (xhr: XMLHttpRequest, response?: IEntity[]): any =>
		{
			// sortuj elementy po nazwie i typie (katalog / plik)
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

			// ukryj panel ładowania
			this._entityLoader.classList.add( "hidden" );
		} ).catch( (error: Error, xhr?: XMLHttpRequest): any =>
		{
			this._onLoadError( error, xhr );
		} );
	}

	/**
	 * Formatuje datę (HH:mm - dd/MM/yyyy) z podanego znacznika czasu.
	 *
	 * PARAMETERS:
	 *     timestamp: number
	 *         Znacznik czasu rozpoczynający się do 1 stycznia 1970 roku.
	 *
	 * RETURNS: string
	 *     Data utworzona względem odpowiedniego formatowania.
	 */
	public formatDate( timestamp: number )
	{
		const date = new Date( timestamp * 1000 );

		const year    = date.getFullYear();
		const month   = date.getMonth() + 1;
		const day     = date.getDate();
		const hours   = date.getHours();
		const minutes = date.getMinutes();

		return (hours > 9 ? hours : "0" + hours) + ":" +
			(minutes > 9 ? minutes : "0" + minutes) + " - " +
			(day > 9 ? day : "0" + day) + "/" +
			(month > 9 ? month  : "0" + month) + "/" + year;
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

		// wyłącz wszystkie przyciski akcji dla pliku
		this._entityButtons( false, false, false );
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
		if( ev )
			ev.stopPropagation();
	}

	/**
	 * Dodaje zdarzenia do kontrolki.
	 */
	private _addEvents(): void
	{
		// przejście do głównego folderu
		this._buttons.home.addEventListener( "click", () => {
			this.getEntities( "/" );
			this._browseFolder( null, null, null );
		} );
		// odświeżenie folderów
		this._buttons.refresh.addEventListener( "click", () => {
			this.getFolders();
			this.getEntities( "/" );

			this._browseFolder( null, null, null );
		} );
		// przejście o jeden folder do góry
		this._buttons.up.addEventListener( "click", ev => {
			this._goToUpperFolder();
		} );
		// przełączanie panelu bocznego
		this._buttons.toggleTree.addEventListener( "click", ev => {
			this._toggleTreePanel();
		} );
		// wyświetlanie szczegółów pliku
		this._buttons.closeInfo.addEventListener( "click", ev => {
			this._toggleInfoView( false );
		} );
		this._buttons.nextFile.addEventListener( "click", ev => {
			this._openNextFileInfo();
		} );
		this._buttons.prevFile.addEventListener( "click", ev => {
			this._openPrevFileInfo();
		} );
	}

	/**
	 * Otwiera następny plik na liście.
	 */
	private _openNextFileInfo(): void
	{
		const obss = this._entities.getObservables();
		const fidx = obss.findIndex( val => val == this._openedFile );

		if( obss.length == fidx + 1 )
			return;

		this._openFileInfo( obss[fidx + 1] );
	}

	/**
	 * Otwiera poprzedni plik na liście.
	 */
	private _openPrevFileInfo(): void
	{
		const obss = this._entities.getObservables();
		const fidx = obss.findIndex( val => val == this._openedFile );
		const pidx = obss.findIndex( val => val.value.type != 'dir' );

		if( pidx > fidx - 1 )
			return;

		this._openFileInfo( obss[fidx - 1] );
	}

	/**
	 * Dodaje subskrypcje do obserwowanych wartości.
	 */
	private _addSubscriptions(): void
	{
		// subskrypcja dla drzewa katalogów
		this._directories.subscribe( obs => {
			this._directorySubscription( obs );
		}, "click" );

		// subskrypcja dla plików w katalogu
		this._entities.subscribe( obs => {
			this._entitySubscription( obs );
		}, "click" );
	}

	/**
	 * Funkcja uruchamiana podczas zmiany elementów w drzewie katalogów.
	 *
	 * DESCRIPTION:
	 *     Funkcja uruchamiana jest dla każdego poziomu drzewa.
	 *     Oznacza to że pojedyncza subskrybcja dla głównego elementu
	 *     automatycznie dodaje subskrypcje dla podelementów w drzewie.
	 *
	 * PARAMETERS:
	 *     obs: ObservableArray<IFolder>
	 *         Lista obserwowanych plików.
	 */
	private _directorySubscription( obs: ObservableArray<IFolder> ): void
	{
		// pobierz obserwowane wartości w drzewie
		const observables = obs.getObservables();

		for( const observable of observables )
		{
			if( !observable.wasUpdated )
				continue;

			// pobierz pierwszy element
			const first = <HTMLElement>observable.element.firstChild;

			const toggle = first.$<HTMLElement>( "[data-click=toggle]" );
			const browse = first.$<HTMLElement>( "[data-click=browse]" );

			// przełączanie rozwinięcia elementu w drzewie
			if( toggle )
				toggle.addEventListener( "click", ev =>
				{
					this._toggleFolderTree( toggle, observable, ev );
				} );
			// otwieranie katalogu
			if( browse )
				browse.addEventListener( "click", ev =>
				{
					if( this._currentObservable == observable )
						return;

					this._browseFolder( browse, observable, ev );

					if( this._currentObservable.value.rolled )
						this._toggleFolderTree( toggle, observable, null );
				} );
		}
	}

	/**
	 * Funkcja uruchamiana podczas zmiany elementów w liście plików.
	 *
	 * PARAMETERS:
	 *     obs: ObservableArray<IEntity>
	 *         Lista obserwowanych plików.
	 */
	private _entitySubscription( obs: ObservableArray<IEntity> ): void
	{
		// pobierz obserwowane wartości
		const observables = obs.getObservables();

		for( const observable of observables )
		{
			if( !observable.wasUpdated )
				continue;

			// zaznacz elementy po kliknięciu
			observable.element.addEventListener( "click", ev =>
			{
				if( this._currentEntity )
					this._currentEntity.classList.remove( "selected" );

				this._currentEntity = observable.element;
				this._currentEntity.classList.add( "selected" );

				// ustaw widoczne przyciski
				if( observable.value.type.toLowerCase() == "dir" )
					this._entityButtons( false, true, true );
				else
					this._entityButtons( true, true, true );
			} );
			// otwórz folder lub szczegóły pliku
			observable.element.addEventListener( "dblclick", ev =>
			{
				// aktualnie zaznaczona wartość
				const cdir = this._currentObservable
					? (
						<RenderArrayTree<IFolder>>
						this._currentObservable.extra.child
					) : this._directories;

				// otwórz folder jeżeli kliknięto na niego
				if( observable.value.type.toLowerCase() == "dir" )
				{
					const obs = cdir.getObservables();
					const idx = obs.findIndex( val =>
						observable.value.name == val.value.name
					);
					if( idx > -1 )
					{
						this._browseFolder(
							<HTMLElement>obs[idx].element.firstChild,
							obs[idx],
							null
						);
						this.rollDownToElem( obs[idx] );
					}
					return;
				}
				// jeżeli jest to plik, otwórz jego szczegóły
				else
					this._openFileInfo( observable );
			} );
		}
	}

	/**
	 * Przełącza widok informacji o aktualnym pliku.
	 *
	 * PARAMETERS:
	 *     visible: Czy informacje o pliku mają być widoczne?
	 */
	private _toggleInfoView( visible: boolean, title: string = "" ): void
	{
		if( visible )
		{
			// pokaż niezbędne przyciski i ukryj niepotrzebne
			this._entityPanel.classList.add( "hidden" );
			this._footerPanel.classList.add( "hidden" );
			this._detailsPanel.classList.remove( "hidden" );

			this._buttons.newFolder.classList.add( "hidden" );
			this._buttons.upload.classList.add( "hidden" );
			this._buttons.up.classList.add( "hidden" );
			this._buttons.closeInfo.classList.remove( "hidden" );

			this._buttons.nextFile.classList.remove( "hidden" );
			this._buttons.prevFile.classList.remove( "hidden" );

			const obss = this._entities.getObservables();
			const fidx = obss.findIndex( val => val.value.type != 'dir' );

			// odblokuj lub zablokuj możliwość przełączenia na poprzedni plik
			if( obss[fidx] == this._openedFile )
				this._buttons.prevFile.classList.add( "disabled" );
			else
				this._buttons.prevFile.classList.remove( "disabled" );

			// odblokuj lub zablokuj możliwość przełączenia na następny plik
			if( obss[obss.length - 1] == this._openedFile )
				this._buttons.nextFile.classList.add( "disabled" );
			else
				this._buttons.nextFile.classList.remove( "disabled" );

			// wyświetl nazwę pliku
			if( title && title != "" )
			{
				this._title.classList.remove( "root" );
				this._title.innerHTML = title;
			}

			// podmień informacje o pliku pod jego podglądem
			this._details.name.innerHTML = this._openedFile.value.name;
			this._details.type.innerHTML = this._openedFile.value.mime;

			this._details.modified.innerHTML =
				this.formatDate( this._openedFile.value.modify );
			this._details.size.innerHTML =
				this.humanReadableSize( this._openedFile.value.size ) + " (" +
				this._openedFile.value.size + " bajtów)";
		}
		else
		{
			// wróć do stanu sprzed wyświetlania informacji o pliku
			this._entityPanel.classList.remove( "hidden" );
			this._footerPanel.classList.remove( "hidden" );
			this._detailsPanel.classList.add( "hidden" );

			this._buttons.newFolder.classList.remove( "hidden" );
			this._buttons.upload.classList.remove( "hidden" );
			this._buttons.up.classList.remove( "hidden" );
			this._buttons.closeInfo.classList.add( "hidden" );

			this._buttons.nextFile.classList.add( "hidden" );
			this._buttons.prevFile.classList.add( "hidden" );

			// przywróć ścieżkę do aktualnego katalogu zamiast nazwy pliku
			if( !this._currentObservable )
			{
				this._title.classList.add( "root" );
				this._title.innerHTML = "Pulsar";
			}
			else
			{
				const path = this.getPath( this._currentObservable );
				this._title.classList.remove( "root" );
				this._title.innerHTML = `/${path}`;
			}
		}
	}

	/**
	 * Otwiera szczegóły pliku.
	 *
	 * PARAMETERS:
	 *     observable: IObservableValue<IEntity>
	 *         Obserwowana wartość zawierająca informacje o pliku.
	 */
	private _openFileInfo( observable: IObservableValue<IEntity> ): void
	{
		if( observable.value.type == 'dir' )
			return;

		this._openedFile = observable;
		this._toggleInfoView( true, observable.value.name );

		const path = this.getPath( this._currentObservable );
		const fsrc = `/micro/filemanager/file/${path}/${observable.value.name}`;

		// podgląd obrazka
		if( observable.value.mime == "image/png" ||
			observable.value.mime == "image/jpeg" ||
			observable.value.mime == "image/gif" )
		{
			this._imgPreview.classList.remove( "hidden" );
			this._filePreview.classList.add( "hidden" );
			this._imgPreview.src = fsrc;
		}
		// lub podgląd zawartości pliku
		else
		{
			this._imgPreview.classList.add( "hidden" );
			this._filePreview.classList.remove( "hidden" );

			qwest.get( fsrc ).then( (xhr: XMLHttpRequest, response: any) => {
				this._filePreview.innerHTML = response;
			} );
		}
	}

	/**
	 * Przełącza przyciski dla akcji dostępnych dla zaznaczonego elementu.
	 *
	 * PARAMETERS:
	 *     download: boolean
	 *         Możliwość pobrania elementu.
	 *     rename: boolean
	 *         Możliwość zmiany nazwy elementu.
	 *     remove: boolean
	 *         Możliwość usunięcia elementu.
	 */
	private _entityButtons(
		download: boolean,
		rename: boolean,
		remove: boolean
	): void
	{
		if( download )
			this._buttons.download.classList.remove( "disabled" );
		else
			this._buttons.download.classList.add( "disabled" );

		if( rename )
			this._buttons.rename.classList.remove( "disabled" );
		else
			this._buttons.rename.classList.add( "disabled" );

		if( remove )
			this._buttons.remove.classList.remove( "disabled" );
		else
			this._buttons.remove.classList.add( "disabled" );
	}

	/**
	 * Przechodzi do folderu powyżej.
	 */
	private _goToUpperFolder(): void
	{
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
	}

	/**
	 * Przełącza panel z drzewem katalogów.
	 */
	private _toggleTreePanel(): void
	{
		// jeżeli folder jest ukryty, pokaż go
		if( this._sidebar.classList.contains("hidden") )
		{
			this._sidebar.classList.remove( "hidden" );
			this._buttons.toggleTree.classList.remove(
				"fa-arrow-circle-o-right"
			);
			this._buttons.toggleTree.classList.add(
				"fa-arrow-circle-o-left"
			);
		}
		// w przeciwnym razie go ukryj
		else
		{
			this._sidebar.classList.add( "hidden" );
			this._buttons.toggleTree.classList.remove(
				"fa-arrow-circle-o-left"
			);
			this._buttons.toggleTree.classList.add(
				"fa-arrow-circle-o-right"
			);
		}
	}

	/**
	 * Pobiera elementy z drzewa DOM.
	 */
	private _prepareElements(): void
	{
		// przyciski w menedżerze
		this._buttons =
		{
			up:         this._fileManager.$<HTMLElement>( "#FM_B-Up" ),
			home:       this._fileManager.$<HTMLElement>( "#FM_B-Home" ),
			refresh:    this._fileManager.$<HTMLElement>( "#FM_B-Refresh" ),
			toggleTree: this._fileManager.$<HTMLElement>( "#FM_B-ToggleTree" ),
			upload:     this._fileManager.$<HTMLElement>( "#FM_B-Upload" ),
			newFolder:  this._fileManager.$<HTMLElement>( "#FM_B-NewFolder" ),
			details:    null,
			download:   this._fileManager.$<HTMLElement>( "#FM_B-Download" ),
			rename:     this._fileManager.$<HTMLElement>( "#FM_B-Rename" ),
			remove:     this._fileManager.$<HTMLElement>( "#FM_B-Remove" ),
			closeInfo:  this._fileManager.$<HTMLElement>( "#FM_B-CloseInfo" ),
			search:     null,
			prevFile:   this._fileManager.$<HTMLElement>( "#FM_B-PrevFile" ),
			nextFile:   this._fileManager.$<HTMLElement>( "#FM_B-NextFile" )
		};

		// szczegóły pliku
		this._details =
		{
			name:      this._fileManager.$<HTMLElement>( "#FM_D-Name" ),
			type:      this._fileManager.$<HTMLElement>( "#FM_D-Type" ),
			modified:  this._fileManager.$<HTMLElement>( "#FM_D-Modified" ),
			size:      this._fileManager.$<HTMLElement>( "#FM_D-Size" ),
			dimension: this._fileManager.$<HTMLElement>( "#FM_D-Dimension" )
		};

		// pozostałe elementy
		this._directoryPanel =
			this._fileManager.$<HTMLElement>( ".directory-tree" );
		this._entityPanel =
			this._fileManager.$<HTMLElement>( ".entities-list" );
		this._title =
			this._fileManager.$<HTMLElement>( ".breadcrumb p" );
		this._directoryLoader =
			this._fileManager.$<HTMLElement>( "#FM_E-Directory" );
		this._entityLoader =
			this._fileManager.$<HTMLElement>( "#FM_E-Entity" );
		this._sidebar =
			this._fileManager.$<HTMLElement>( "#FM_E-Sidebar" );
		this._detailsPanel =
			this._fileManager.$<HTMLElement>( "#FM_E-Details" );
		this._footerPanel =
			this._fileManager.$<HTMLElement>( "#FM_E-Footer" );
		this._imgPreview =
			this._fileManager.$<HTMLImageElement>( "#FM_E-ImgPreview" );
		this._filePreview =
			this._fileManager.$<HTMLTextAreaElement>( "#FM_E-FilePreview" );

		// szablon dla elementu wyświetlanego w prawym panelu
		const etpl = this._fileManager.$( "#FM_T-EntityItem" );
		this._entityTemplate = etpl
			? etpl.innerHTML
			: '';
		// szablon dla elementu wyświetlanego w lewym panelu
		const dtpl = this._fileManager.$( "#FM_T-DirectoryItem" );
		this._directoryTemplate = dtpl
			? dtpl.innerHTML
			: '';
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
