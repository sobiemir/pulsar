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

interface NodeList
{
	findIdxByFunc( func: (elem: any) => boolean ): number;
}

NodeList.prototype.findIdxByFunc = function( func: (e: any) => boolean): number
{
	for( let x = 0; x < this.length; ++x )
		if( func(this[x]) )
			return x;
	return -1;
};
