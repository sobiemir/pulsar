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

class Logger
{
	private static _debugs: string[] = [];
	private static _infos: string[] = [];
	private static _warnings: string[] = [];
	private static _errors: string[] = [];

	private static _messages = {
		NoAttrElem: "Missing element defined in '{0}' attribute",
		NoIndex: "Object doesn't have index with name '{0}'",
		NoElem: "Element with selector '{0}' doesn't exist in current content"
	};

// -----------------------------------------------------------------------------

	public static Debug( category: string, message: string ): boolean
	{
		message = `[${category}]: ${message}.`;

		this._debugs.push( message );
		console.log( message );

		return true;
	}

	public static Info( category: string, message: string ): boolean
	{
		message = `[${category}]: ${message}.`;

		this._infos.push( message );
		console.info( message );

		return true;
	}

	public static Warning( category: string, message: string ): boolean
	{
		message = `[${category}]: ${message}.`;

		this._warnings.push( message );
		console.warn( message );

		return true;
	}

	public static Error( category: string, message: string ): boolean
	{
		message = `[${category}]: ${message}.`;

		this._errors.push( message );
		console.error( message );

		return true;
	}

	public static $( category: string, index: string, ...args: any[] ): boolean
	{
		if( !(index in this._messages) )
			this.Error(
				"log",
				`Cannot find static message with index '${index}'`
			);
		else
			this.Warning(
				category,
				(<string>(<any>this._messages)[index]).formatArgs(args)
			);

		return true;
	}
}
