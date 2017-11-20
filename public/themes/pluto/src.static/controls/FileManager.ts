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
	private _directoryPanel: HTMLElement = null;
	private _directories: RenderArrayTree<IFolder> = null;
	private _entities: RenderArray<IEntity> = null;
	private _entityPanel: HTMLElement = null;
	private _entityTemplate: string = '';
	private _directoryTemplate: string = '';

	private _currentElement: HTMLElement = null;

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

		const etpl = this._fileManager.$( "#tpl-entity-item" );
		this._entityTemplate = etpl
			? etpl.innerHTML
			: '';
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

		this._entities.options({
			single: false,
			template: this._entityTemplate,
			place: this._entityPanel
		});

		this.getFolders();
		this.getEntities();
	}

	private _browseFolder(
		element:    HTMLElement,
		observable: IObservableValue<IFolder>,
		ev:         MouseEvent
	): void
	{
		const first = <HTMLElement>observable.element.firstChild;

		if( this._currentElement )
			this._currentElement.classList.remove( "selected" );

		this._currentElement = first;
		this._currentElement.classList.add( "selected" );

		console.log( this.getPath(observable) );
		this.getEntities( this.getPath(observable) );
	}

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

	public getPath( elem: IObservableValue<IFolder>, path: string = "" ): string
	{
		if( elem.extra.owner.getUpper() )
			return this.getPath(
				elem.extra.owner.getUpper(),
				`${elem.value.name}/${path}`
			);
		return `${elem.value.name}/${path}`;
	}

	public getFolders(): Qwest.Promise
	{
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
		} ).catch( (error: Error, xhr?: XMLHttpRequest): any => {
			this._onLoadError( error, xhr );
		} );
	}

	public getEntities( folder: string = '/' ): Qwest.Promise
	{
		return qwest.post( "/micro/filemanager/entities", {
			path: folder
		} ).then( (xhr: XMLHttpRequest, response?: IEntity[]): any => {
				response.sort( (a, b) => {
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
			} ).catch( (error: Error, xhr?: XMLHttpRequest): any => {
				this._onLoadError( error, xhr );
			} );
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
	 * Dodaje zdarzenia do kontrolki.
	 *
	 * DESCRIPTION:
	 *     Kontrolka oprócz przełączania kontekstu i zakładek obsługuje również
	 *     inne akcje, jak np. czyszczenie lub ustawianie flagi modelu.
	 *     Szczegóły dotyczące tego jak działają te opcje i jak je ustawić
	 *     znajdują się w opisie klasy.
	 */
	public addEvents(): void
	{
		// if( this._failed )
		// 	return;

		// this._control.addEventListener( "click", this._onTabChange );

		// // te dwa przyciski wiążą się ze sobą, więc muszą być razem
		// if( !this._create || !this._remove )
		// 	return;

		// this._create.addEventListener( "click", this._onCreateLanguage );
		// this._remove.addEventListener( "click", this._onRemoveLanguage );
	}

// =============================================================================

	private _onLoadError = ( error: Error, xml: XMLHttpRequest ): void =>
	{
		console.log( error );
	}
}
