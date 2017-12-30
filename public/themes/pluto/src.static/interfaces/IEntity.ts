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
 * Interfejs dla obiektu zawierającego informacje o elemencie.
 */
interface IEntity
{
	/**
	 * Nazwa elementu.
	 *
	 * TYPE: string
	 */
	name: string;

	/**
	 * Rozmiar elementu (tylko w przypadku pliku).
	 *
	 * TYPE: number
	 */
	size: number;

	/**
	 * Data (timestamp) ostatniej modyfikacji elementu.
	 * 
	 * TYPE: number
	 */
	modify: number;

	/**
	 * Data (timestamp) ostatniego dostępu do elementu.
	 *
	 * TYPE: number
	 */
	access: number;

	/**
	 * Typ elementu (plik / katalog / skrót).
	 *
	 * TYPE: string
	 */
	type: string;

	/**
	 * Typ mime (np. text/plain) dla pliku, wzorowany na repozytorium httpd.
	 *
	 * TYPE: string
	 */
	mime: string;
}

// =============================================================================

/**
 * Interfejs dla obiektu zawierającego informacje o katalogu.
 */
interface IDirectory
{
	/**
	 * Nazwa katalogu.
	 *
	 * TYPE: string
	 */
	name: string;

	/**
	 * Data (timestamp) ostatniej modyfikacji.
	 * 
	 * TYPE: number
	 */
	modify: number;

	/**
	 * Data (timestamp) ostatniego dostępu do katalogu.
	 *
	 * TYPE: number
	 */
	access: number;

	/**
	 * Lista podkatalogów znajdujących się w katalogu.
	 *
	 * TYPE: IDirectory[]
	 */
	children: IDirectory[];

	/**
	 * Czy katalog jest rozwinięty czy zwinięty?
	 *
	 * TYPE: boolean
	 */
	rolled: boolean;

	/**
	 * Czy katalog został zaznaczony i jest otworzony?
	 *
	 * TYPE: boolean
	 */
	checked: boolean;
}
