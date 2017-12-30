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
 * Klasa tworząca menedżer plików.
 *
 * DESCRIPTION:
 *     Na jednej stronie może znajdować się tylko jeden menedżer plików.
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
	 * Lista paneli używanych w menedżerze plików.
	 *
	 * TYPE: IFileManagerPanels
	 */
	private _panels: IFileManagerPanels;

	/**
	 * Lista dodatkowych kontrolek menedżera plików.
	 *
	 * TYPE: IFileManagerControls
	 */
	private _controls: IFileManagerControls;

	/**
	 * Elementy do których zapisywane będą szczegóły pliku.
	 *
	 * TYPE: IFileManagerDetails
	 */
	private _details: IFileManagerDetails;

	/**
	 * Główny element na którym opiera się menedżer plików.
	 *
	 * TYPE: HTMLElement
	 */
	private _fileManager: HTMLElement;

	/**
	 * Lista katalogów w postaci obserwowanej renderowanej tablicy drzewa.
	 *
	 * TYPE: RenderArrayTree<IDirectory>
	 */
	private _directories: RenderArrayTree<IDirectory>;

	/**
	 * Lista elementów w katalogu w postaci obserwowanej renderowanej tablicy.
	 * 
	 * TYPE: RenderArray<IEntity>
	 */
	private _entities: RenderArray<IEntity>;

	/**
	 * Szablon pojedynczego elementu w prawym panelu.
	 *
	 * TYPE: string
	 */
	private _entityTemplate: string | doT.RenderFunction;

	/**
	 * Szablon pojedynczego elementu w lewym panelu.
	 *
	 * TYPE: string
	 */
	private _directoryTemplate: string | doT.RenderFunction;

	/**
	 * Aktualnie zaznaczony element w panelu z drzewem katalogów.
	 *
	 * TYPE: HTMLElement
	 */
	private _currentElement: HTMLElement;

	/**
	 * Aktualnie zaznaczony katalog z obserwowaną wartością.
	 * 
	 * TYPE: IObservableValue<IDirectory>
	 */
	private _currentObservable: IObservableValue<IDirectory>;

	/**
	 * Aktualny obiekt zaznaczony w prawym panelu.
	 *
	 * TYPE: HTMLElement
	 */
	private _currentEntity: HTMLElement;

	/**
	 * Aktualnie zaznaczony element.
	 *
	 * TYPE: IObservableValue<IEntity>
	 */
	private _selectedEntity: IObservableValue<IEntity>;

	/**
	 * Aktualnie otwarty plik.
	 *
	 * TYPE: IObservableValue<IEntity>
	 */
	private _openedFile: IObservableValue<IEntity>;

	/**
	 * Flaga błędu przetwarzania danych w kontrolce.
	 *
	 * TYPE: boolean
	 */
	private _failed: boolean = false;

	/**
	 * Lista opcji przekazywanych w konstruktorze menedżera plików.
	 *
	 * TYPE: IFileManagerOptions
	 */
	private _options: IFileManagerOptions;

// =============================================================================

	/**
	 * Konstruktor kontrolki.
	 *
	 * PARAMETERS:
	 *     tab: (HTMLElement)
	 *         Główny element na którym opiera się menedżer plików.
	 */
	public constructor( options: IFileManagerOptions )
	{
		this._directories = new RenderArrayTree();
		this._entities    = new RenderArray();
		this._fileManager = typeof options.element == "string"
			? $( options.element )
			: options.element;

		// sprawdź czy element istnieje
		if( !this._fileManager )
		{
			Logger.Warning(
				"fm",
				"Main element for filemanager was not found"
			);
			this._failed = true;
			return;
		}

		// inicjalizuj podstawowe zmienne
		this._details = {
			name:      null,
			type:      null,
			modified:  null,
			size:      null,
			dimension: null
		};
		this._panels = {
			directories:     null,
			entities:        null,
			details:         null,
			footer:          null,
			createDirectory: null,
			uploadFile:      null,
			entityLoader:    null,
			directoryLoader: null,
			sidebar:         null
		};
		this._buttons = {
			up:              null,
			home:            null,
			refresh:         null,
			toggleTree:      null,
			showUploadPanel: null,
			showCreatePanel: null,
			download:        null,
			rename:          null,
			remove:          null,
			closePreview:    null,
			nextFile:        null,
			prevFile:        null,
			downloadCurrent: null,
			createDirectory: null,
			uploadFile:      null
		};
		this._controls = {
			selectedFiles:   null,
			uploadFile:      null,
			title:           null,
			imagePreview:    null,
			filePreview:     null,
			entityName:      null
		};

		this._options = options;

		// przygotuj elementy menedżera
		this._prepareElements();

		this._directories.options({
			treeSelector: this._options.treeSelector,
			childIndex:   this._options.childIndex,
			template:     this._directoryTemplate,
			place:        this._panels.directories
		});

		// zdarzenia i subskrypcje
		this._addEvents();
		this._addSubscriptions();

		// opcje renderowanych elementów
		this._entities.options({
			single:     false,
			template:   this._entityTemplate,
			place:      this._panels.entities,
			callObject: this
		});

		this.getDirectories();
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
	 * Pobiera ścieżkę z podanego katalogu.
	 *
	 * PARAMETERS:
	 *     elem: IObservableValue<IDirectory>
	 *         Element z którego ścieżka będzie wnioskowana.
	 *     path: string
	 *         Ścieżka do dodania na koniec.
	 *
	 * RETURNS: string
	 *     Utworzona ścieżka do elementu.
	 */
	public getPath( elem: IObservableValue<IDirectory>, path: string = "" ):
		string
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
	 *     elem: IObservableValue<IDirectory>
	 *         Element od którego ma się rozpocząć rozwijanie w górę.
	 */
	public rollDownToElem( elem: IObservableValue<IDirectory> ): void
	{
		// sprawdź czy drzewo w elemencie jest rozwinięte czy nie
		elem.value.rolled = true;
		if( elem.value.rolled )
		{
			// jeżeli nie, rozwiń go
			const toggle = elem.element.$<HTMLElement>( "[data-click=toggle]" );

			if( toggle != null )
				this._toggleDirectory(
					toggle,
					elem,
					null
				);
		}

		// sprawdź czy istnieje rozdzic, który może być rozwinięty
		const extra = <IRenderTreeExtra<IDirectory>>elem.extra;
		const upper = extra.owner.getUpper();

		if( !upper )
			return;

		// jeżeli tak, wywołaj samą siebie aby go rozwinąć
		this.rollDownToElem( upper );
	}

	/**
	 * Wysyła żądanie do serwera o drzewo katalogów.
	 *
	 * RETURNS: Qwest.Promise
	 *     Obiekt oczekujący na wykonanie zapytania.
	 */
	public getDirectories(): Qwest.Promise
	{
		// pokaż panel ładowania
		this._panels.directoryLoader.classList.remove( "hidden" );

		// wyślij żądanie o listę katalogów
		return qwest
		.post( "/micro/filemanager/directories",
		{
			path: '/',
			recursive: 1
		} )
		.then( (xhr: XMLHttpRequest, response?: IDirectory[]): any =>
		{
			// zwiń wszystkie elementy
			const rolled = (val: IDirectory): void =>
			{
				val.rolled = true;
				if( val.children && val.children.length )
					val.children.forEach( rolled );
			};
			response.forEach( rolled );

			// posortuj względem nazwy całe drzewo
			response.deepSort( (a, b) => {
				return a.name.localeCompare( b.name );
			}, this._options.childIndex );

			this._directories.set( response );

			// i schowaj panel ładowania
			this._panels.directoryLoader.classList.add( "hidden" );
		} )
		.catch( this._qwestError );
	}

	/**
	 * Wysyła żądanie do serwera o listę elementów w katalogu.
	 *
	 * PARAMETERS:
	 *     directory: string
	 *         Katalog z którego elementy mają być pobierane.
	 * 
	 * RETURNS: Qwest.Promise
	 *     Obiekt oczekujący na wykonanie zapytania.
	 */
	public getEntities( directory: string = '/' ): Qwest.Promise
	{
		// pokaż panel ładowania
		this._panels.entityLoader.classList.remove( "hidden" );

		// wyślij żądanie o listę plików w katalogu
		return qwest
		.post( "/micro/filemanager/entities",
		{
			path: directory
		} )
		.then( (xhr: XMLHttpRequest, response?: IEntity[]): any =>
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
			this._panels.entityLoader.classList.add( "hidden" );
		} )
		.catch( this._qwestError );
	}

// =============================================================================

	/**
	 * Akcja wywoływana po kliknięciu w katalog z lewego panelu.
	 *
	 * PARAMETERS:
	 *     element: HTMLElement
	 *         Kliknięty element w drzewie.
	 *     observable: IObservableValue<IDirectory>
	 *         Zmienna zawierająca dane na temat katalogu.
	 *     ev: MouseEvent
	 *         Argumenty zdarzenia.
	 */
	private _browseDirectory(
		element:    HTMLElement,
		observable: IObservableValue<IDirectory>,
		ev:         MouseEvent
	): void
	{
		// jeżeli został zaznaczony już katalog, odznacz go
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

			this._controls.title.classList.remove( "root" );
			this._controls.title.innerHTML = `/${path}`;
		}
		// gdy brak aktualnego elementu, pobierz zawartość głównego katalogu
		else
		{
			this._controls.title.classList.add( "root" );
			this._controls.title.innerHTML = "Pulsar";
		}

		// wyłącz wszystkie przyciski akcji dla pliku
		this._entityButtons( false, false, false );

		// wyłącz podgląd pliku jeżeli jest włączony
		this._togglePreview( false );
	}

	/**
	 * Akcja wywoływana podczas kliknięcia w ikonę rozwijania katalogów.
	 *
	 * PARAMETERS:
	 *     element: HTMLElement
	 *         Kliknięty element w drzewie.
	 *     observable: IObservableValue<IDirectory>
	 *         Zmienna zawierająca dane na temat katalogu.
	 *     ev: MouseEvent
	 *         Argumenty zdarzenia.
	 */
	private _toggleDirectory(
		element:    HTMLElement,
		observable: IObservableValue<IDirectory>,
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

		// nie otwieraj katalogu po rozwinięciu
		if( ev )
			ev.stopPropagation();
	}

	/**
	 * Dodaje zdarzenia do kontrolki.
	 */
	private _addEvents(): void
	{
		const buttons = this._buttons;

		// przejście do głównego folderu
		buttons.home.addEventListener( "click", () => {
			this.getEntities( "/" );
			this._browseDirectory( null, null, null );
		} );
		// odświeżenie folderów
		buttons.refresh.addEventListener( "click", () => {
			this.getDirectories();
			this.getEntities( "/" );

			this._browseDirectory( null, null, null );
		} );
		// przejście o jeden folder do góry
		buttons.up.addEventListener( "click", () => {
			this._goToUpperDirectory();
		} );
		// przełączanie panelu bocznego
		buttons.toggleTree.addEventListener( "click", () => {
			this._toggleTreePanel();
		} );
		// wyświetlanie szczegółów pliku
		buttons.closePreview.addEventListener( "click", () => {
			this._togglePreview( false );
		} );
		// przejście do następnego pliku
		buttons.nextFile.addEventListener( "click", () => {
			this._previewNextFile();
		} );
		// przejście do poprzedniego pliku
		buttons.prevFile.addEventListener( "click", () => {
			this._previewPreviousFile();
		} );
		// otwieranie panelu tworzenia nowego folderu
		buttons.showCreatePanel.addEventListener( "click", (ev: MouseEvent) => {
			this._panels.createDirectory.classList.remove( "hidden" );
			this._panels.uploadFile.classList.add( "hidden" );
			this._controls.entityName.focus();

			ev.stopPropagation();
		} );
		// tworzenie nowego folderu poprzez wciśnięcie przycisku
		buttons.createDirectory.addEventListener( "click", () => {
			this._createDirectory( this._controls.entityName.value );
			this._controls.entityName.value = "";
			this._panels.createDirectory.classList.add( "hidden" );
		} );
		// ukrywanie panelu dodawania folderu i plików
		this._fileManager.addEventListener( "click", ev => {
			if( this._panels.createDirectory.contains(<Node>ev.target) ||
				this._panels.uploadFile.contains(<Node>ev.target) )
				return;
			this._panels.createDirectory.classList.add( "hidden" );
			this._panels.uploadFile.classList.add( "hidden" );
		} );
		// tworzenie nowego folderu
		this._controls.entityName.addEventListener( "keypress", ev => {
			if( ev.keyCode == 13 || ev.which == 13 )
			{
				this._createDirectory( this._controls.entityName.value );
				this._controls.entityName.value = "";
				this._panels.createDirectory.classList.add( "hidden" );
			}
		} );
		// zmiana pliku
		this._controls.uploadFile.addEventListener( "change", ev =>
		{
			const uploadControl = this._controls.uploadFile;
			let fm = "";

			// brak plików
			if( !uploadControl.files || uploadControl.files.length == 0 )
				fm = "Brak plików...";
			// gdy są, wypisz je wszystkie
			else
				for( let x = 0; x < uploadControl.files.length; ++x )
				{
					const ifm = uploadControl.value.replace(/\\/g,"/")
						.split( '/' ).pop();

					fm += ifm + (uploadControl.files.length - 1 == x
						? ""
						: " / "
					);
				}

			// sprawdź dla pewności czy na pewno wykryto jakieś pliki
			fm = fm.trim();
			if( fm != "" )
				this._controls.selectedFiles.value = fm;
			else
				this._controls.selectedFiles.value = "Brak plików...";
		} );
		// akcja wywoływana przy wciśnięciu przycisku wgrywania plików
		this._panels.uploadFile.addEventListener("submit", (ev: MouseEvent) => {
			const fdata = new FormData( this._panels.uploadFile );

			// ustaw folder do którego pliki będą wgrywane
			fdata.set( 'path', this.getPath(this._currentObservable) );

			// wgraj pliki na serwer
			qwest
			.post( "/micro/filemanager/upload", fdata )
			.then(
				(xhr: XMLHttpRequest, response: any) => {
					if( response.status != 200 )
						return;

					const file = <any>fdata.get( 'upload_files' );

					this._entities.push( {
						name: file.name,
						size: file.size,
						mime: file.type,
						modify: file.lastModified,
						access: Date.now() / 1000 | 0,
						type: 'file'
					} );

					// posortuj
					this._entities.getObservables().sort( (a, b) =>
					{
						const ret = a.value.name.localeCompare( b.value.name );

						if( a.value.type === b.value.type )
							return ret;
						else if( a.value.type === "dir" )
							return -1;
						else if( b.value.type === "dir" )
							return 1;

						return ret;
					} );
					// odśwież po sortowaniu
					this._entities.runSubscribers();

					// ukryj panel
					this._panels.uploadFile.classList.add( "hidden" );
				}
			)
			.catch( this._qwestError );

			ev.preventDefault();
			return false;
		} );
		// akcja wywoływana podczas otwierania panelu wgrywania plików
		buttons.showUploadPanel.addEventListener( "click", (ev: MouseEvent) => {
			this._panels.createDirectory.classList.add( "hidden" );
			this._panels.uploadFile.classList.remove( "hidden" );
			ev.stopPropagation();
		} );
	}

	/**
	 * Tworzy katalog w aktualnej lokalizacji o podanej nazwie.
	 */
	private _createDirectory( name: string ): void
	{
		const path = this.getPath( this._currentObservable );

		qwest
		.post( "/micro/filemanager/create-directory", {
			path: `${path}${name}`
		} )
		.then( (xhr: XMLHttpRequest, response) => {
			if( response.status == '200' )
			{
				// wstaw element do tablicy
				this._entities.push( {
					name: name,
					size: 0,
					modify: Date.now() / 1000 | 0,
					access: Date.now() / 1000 | 0,
					type: 'dir',
					mime: ''
				} );
				// posortuj
				this._entities.getObservables().sort( (a, b) =>
				{
					const ret = a.value.name.localeCompare( b.value.name );

					if( a.value.type === b.value.type )
						return ret;
					else if( a.value.type === "dir" )
						return -1;
					else if( b.value.type === "dir" )
						return 1;

					return ret;
				} );
				// odśwież po sortowaniu
				this._entities.runSubscribers();

				let owner = <RenderArrayTree<IDirectory>>(
					this._currentObservable
						? this._currentObservable.extra.child
						: this._directories
				);

				const val = {
					name: name,
					modify: Date.now() / 1000 | 0,
					access: Date.now() / 1000 | 0,
					children: [],
					rolled: true,
					checked: false
				} as IDirectory;

				if( this._directories == null )
					return;
				else if( owner == null )
				{
					// utwórz drzewo z podelementami
					this._currentObservable.extra.owner.createChild(
						this._currentObservable,
						[ val ]
					);
					this._currentObservable.value.children.push( val );
					owner = this._currentObservable.extra.child;
				}
				else
				{
					owner.push( val );
					this._currentObservable.value.children.push( val );
				}

				// posortuj
				owner.getObservables().sort(
					(a, b) => a.value.name.localeCompare( b.value.name )
				);

				if( this._currentObservable )
					this._currentObservable.needUpdate = true;

				// odśwież drzewo
				this._directories.runSubscribers();

				this._browseDirectory(
					<HTMLElement>this._currentObservable.element.firstChild,
					this._currentObservable,
					null
				);
				this.rollDownToElem( this._currentObservable );
			}
		} )
		.catch( this._qwestError );
	}

	/**
	 * Otwiera następny plik na liście.
	 */
	private _previewNextFile(): void
	{
		const obss = this._entities.getObservables();
		const fidx = obss.findIndex( val => val == this._openedFile );

		if( obss.length == fidx + 1 )
			return;

		this._previewFile( obss[fidx + 1] );
	}

	/**
	 * Otwiera poprzedni plik na liście.
	 */
	private _previewPreviousFile(): void
	{
		const obss = this._entities.getObservables();
		const fidx = obss.findIndex( val => val == this._openedFile );
		const pidx = obss.findIndex( val => val.value.type != 'dir' );

		if( pidx > fidx - 1 )
			return;

		this._previewFile( obss[fidx - 1] );
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
	 *     obs: ObservableArray<IDirectory>
	 *         Lista obserwowanych plików.
	 */
	private _directorySubscription( obs: ObservableArray<IDirectory> ): void
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
					this._toggleDirectory( toggle, observable, ev );
				} );
			// otwieranie katalogu
			if( browse )
				browse.addEventListener( "click", ev =>
				{
					if( this._currentObservable == observable )
						return;

					this._browseDirectory( browse, observable, ev );

					if( this._currentObservable.value.rolled )
						this._toggleDirectory( toggle, observable, null );
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
				this._selectedEntity = observable;
				this._currentEntity.classList.add( "selected" );

				// ustaw widoczne przyciski
				if( observable.value.type.toLowerCase() == "dir" )
					this._entityButtons( false, true, true );
				else
					this._entityButtons( true, true, true );
			} );
			// otwórz katalog lub szczegóły pliku
			observable.element.addEventListener( "dblclick", ev =>
			{
				// aktualnie zaznaczona wartość
				const cdir = this._currentObservable
					? (
						<RenderArrayTree<IDirectory>>
						this._currentObservable.extra.child
					) : this._directories;

				// otwórz katalog jeżeli kliknięto na niego
				if( observable.value.type.toLowerCase() == "dir" )
				{
					const obs = cdir.getObservables();
					const idx = obs.findIndex( val =>
						observable.value.name == val.value.name
					);
					if( idx > -1 )
					{
						this._browseDirectory(
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
					this._previewFile( observable );
			} );
		}
	}

	/**
	 * Przełącza widok informacji o aktualnym pliku.
	 *
	 * DESCRIPTION:
	 *     Przełączenie widoku wiąże się nie tylko z przełączeniem aktualnie
	 *     wyświetlanego kontenera, ale również z przełączeniem ikon.
	 *     Okno podglądu pliku posiada inny układ i inne akcje, które muszą
	 *     być wyświetlone dla użytkownika.
	 *     W przypadku wyświetlania pliku funkcja zamienia również napis
	 *     na górnej belce z aktualnej ścieżki na nazwę wyświetlanego pliku.
	 *
	 * PARAMETERS:
	 *     visible: boolean
	 *         Czy informacje o pliku mają być widoczne?
	 *     title: string
	 *         Napis na górnej belce (standardowo nazwa pliku lub ścieżka).
	 */
	private _togglePreview( visible: boolean, title: string = "" ): void
	{
		if( visible )
		{
			// ukryj niepotrzebne elementy
			this._panels.entities.classList.add( "hidden" );
			this._panels.footer.classList.add( "hidden" );

			this._buttons.showCreatePanel.classList.add( "hidden" );
			this._buttons.showUploadPanel.classList.add( "hidden" );
			this._buttons.up.classList.add( "hidden" );

			// i pokaż pozostałe
			this._panels.details.classList.remove( "hidden" );

			this._buttons.closePreview.classList.remove( "hidden" );
			this._buttons.downloadCurrent.classList.remove( "hidden" );
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

			// wyświetl nazwę pliku zamiast ścieżki do aktualnego katalogu
			if( title && title != "" )
			{
				this._controls.title.classList.remove( "root" );
				this._controls.title.innerHTML = title;
			}

			// podmień informacje o pliku pod jego podglądem
			this._details.name.innerHTML = this._openedFile.value.name;
			this._details.type.innerHTML = this._openedFile.value.mime == ''
				? '---'
				: this._openedFile.value.mime;

			this._details.modified.innerHTML =
				this._openedFile.value.modify.toDateString();
			this._details.size.innerHTML =
				this._openedFile.value.size.toSizeString() + " (" +
				this._openedFile.value.size + " bajtów)";

			const file = this._openedFile.value.name;
			const path = this.getPath( this._currentObservable );

			this._buttons.downloadCurrent.href =
				`/micro/filemanager/download/${path}${file}`;
		}
		else
		{
			// ukryj niepotrzebne elementy
			this._panels.details.classList.add( "hidden" );

			this._buttons.closePreview.classList.add( "hidden" );
			this._buttons.downloadCurrent.classList.add( "hidden" );
			this._buttons.nextFile.classList.add( "hidden" );
			this._buttons.prevFile.classList.add( "hidden" );

			// i pokaż pozostałe
			this._panels.entities.classList.remove( "hidden" );
			this._panels.footer.classList.remove( "hidden" );

			this._buttons.showCreatePanel.classList.remove( "hidden" );
			this._buttons.showUploadPanel.classList.remove( "hidden" );
			this._buttons.up.classList.remove( "hidden" );

			// przywróć ścieżkę do aktualnego katalogu zamiast nazwy pliku
			if( !this._currentObservable )
			{
				this._controls.title.classList.add( "root" );
				this._controls.title.innerHTML = "Pulsar";
			}
			else
			{
				const path = this.getPath( this._currentObservable );
				this._controls.title.classList.remove( "root" );
				this._controls.title.innerHTML = `/${path}`;
			}
		}
	}

	/**
	 * Otwiera podgląd pliku wraz z jego podstawowymi informacjami.
	 *
	 * PARAMETERS:
	 *     observable: IObservableValue<IEntity>
	 *         Obserwowana wartość zawierająca informacje o pliku.
	 */
	private _previewFile( observable: IObservableValue<IEntity> ): void
	{
		if( observable.value.type == 'dir' )
			return;

		this._openedFile = observable;
		this._togglePreview( true, observable.value.name );

		const path = this.getPath( this._currentObservable );
		const file = observable.value.name;
		const fsrc = `/micro/filemanager/preview/${path}/${file}`;

		// podgląd obrazka
		if( observable.value.mime == "image/png" ||
			observable.value.mime == "image/jpeg" ||
			observable.value.mime == "image/gif" )
		{
			this._controls.imagePreview.classList.remove( "hidden" );
			this._controls.filePreview.classList.add( "hidden" );
			this._controls.imagePreview.src = fsrc;
		}
		// lub podgląd zawartości pliku
		else
		{
			this._controls.imagePreview.classList.add( "hidden" );
			this._controls.filePreview.classList.remove( "hidden" );

			qwest.get( fsrc )
			.then( (xhr: XMLHttpRequest, response: any) => {
				this._controls.filePreview.innerHTML = response;
			} )
			.catch( this._qwestError );
		}
	}

	/**
	 * Przełącza przyciski akcji dostępnych dla zaznaczonego elementu.
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
		// przycisk pobierania elementu
		if( download )
		{
			const path = this.getPath( this._currentObservable );
			const file = this._selectedEntity.value.name;

			this._buttons.download.classList.remove( "disabled" );
			this._buttons.download.href =
				`/micro/filemanager/download/${path}${file}`;
		}
		else
		{
			this._buttons.download.classList.add( "disabled" );
			this._buttons.download.href = "#";
		}

		// przycisk zmiany nazwy
		if( rename )
			this._buttons.rename.classList.remove( "disabled" );
		else
			this._buttons.rename.classList.add( "disabled" );

		// przycisk usuwania
		if( remove )
			this._buttons.remove.classList.remove( "disabled" );
		else
			this._buttons.remove.classList.add( "disabled" );
	}

	/**
	 * Przechodzi do katalogu wyżej w hierarchii.
	 */
	private _goToUpperDirectory(): void
	{
		if( !this._currentObservable )
			return;

		// sprawdź czy użytkownik nie przechodzi do katalogu głównego
		if( !this._currentObservable.extra.owner.getUpper() )
		{
			this._browseDirectory( null, null, null );
			this.getEntities( "/" );
			return;
		}

		const upper = <IObservableValue<IDirectory>>
			this._currentObservable.extra.owner.getUpper();

		this._browseDirectory(
			<HTMLElement>upper.element.firstChild,
			upper,
			null
		);
	}

	/**
	 * Przełącza panel z drzewem katalogów.
	 *
	 * DESCRIPTION:
	 *     Ukrywa lub pokazuje panel wyświetlający drzewo katalogów.
	 *     Ukrycie powoduje również zmianę ikony na przycisku który odpowiada
	 *     za wywołanie tej akcji.
	 */
	private _toggleTreePanel(): void
	{
		// jeżeli folder jest ukryty, pokaż go
		if( this._panels.sidebar.classList.contains("hidden") )
		{
			this._panels.sidebar.classList.remove( "hidden" );
			this._buttons.toggleTree.classList.remove(
				this._options.actionClasses.showSidebar
			);
			this._buttons.toggleTree.classList.add(
				this._options.actionClasses.hideSidebar
			);
		}
		// w przeciwnym razie go ukryj
		else
		{
			this._panels.sidebar.classList.add( "hidden" );
			this._buttons.toggleTree.classList.remove(
				this._options.actionClasses.hideSidebar
			);
			this._buttons.toggleTree.classList.add(
				this._options.actionClasses.showSidebar
			);
		}
	}

	/**
	 * Przygotowuje menedżer plików do działania.
	 *
	 * DESCRIPTION:
	 *     Sprawdza przekazane w konstruktorze opcje i w zależności od ich
	 *     zawartości pobiera elementy z drzewa DOM lub przypisuje te które
	 *     zostały podane.
	 *     Pobiera również szablony w przypadku gdy w opcjach podane zostały
	 *     selektory zamiast funkcji.
	 */
	private _prepareElements(): void
	{
		if( this._failed )
			return;

		const $fm = this._fileManager;

		// pobierz kontrolki
		const buttons  = $fm.$$<HTMLElement>( "[data-button]"  );
		const details  = $fm.$$<HTMLElement>( "[data-detail]"  );
		const panels   = $fm.$$<HTMLElement>( "[data-panel]"   );
		const controls = $fm.$$<HTMLElement>( "[data-control]" );

		// i przypisz je do odpowiednich zmiennych
		$fill( this._buttons,  buttons,  "dataset", "button"  );
		$fill( this._details,  details,  "dataset", "detail"  );
		$fill( this._panels,   panels,   "dataset", "panel"   );
		$fill( this._controls, controls, "dataset", "control" );

		// szablon dla elementu wyświetlanego w prawym panelu
		if( this._options.entityTemplate )
			this._entityTemplate = this._options.entityTemplate;
		else
		{
			const elem = $fm.$( "[data-template=entity]" );
			this._entityTemplate = elem != null
				? elem.innerHTML
				: null;
		}

		// szablon dla elementu wyświetlanego w lewym panelu
		if( this._options.directoryTemplate )
			this._directoryTemplate = this._options.directoryTemplate;
		else
		{
			const elem = $fm.$( "[data-template=directory]" );
			this._directoryTemplate = elem != null
				? elem.innerHTML
				: null;
		}
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
	private _qwestError = ( error: Error, xml: XMLHttpRequest ): void =>
	{
		console.log( error );
	}
}
