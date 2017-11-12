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

let uglifyjs = require( "uglify-js" );
let fs       = require( "fs" );
let path     = require( "path" );

// lista plików do kopiowania
let css_files = [
	"node_modules/font-awesome/css/font-awesome.css",
	"node_modules/font-awesome/css/font-awesome.css.map",
	"node_modules/font-awesome/css/font-awesome.min.css"
];
let font_files = [
	"node_modules/font-awesome/fonts/FontAwesome.otf",
	"node_modules/font-awesome/fonts/fontawesome-webfont.eot",
	"node_modules/font-awesome/fonts/fontawesome-webfont.svg",
	"node_modules/font-awesome/fonts/fontawesome-webfont.ttf",
	"node_modules/font-awesome/fonts/fontawesome-webfont.woff",
	"node_modules/font-awesome/fonts/fontawesome-webfont.woff2"
];
let js_files = [
	"node_modules/requirejs/require.js",
	"node_modules/requirejs/require.min.js"
];

// pliki css
for( const file of css_files )
{
	let fname = path.posix.basename( file );

	console.log( `[css] Kopiowanie pliku: ${fname}` );
	fs.copyFileSync( file, `public/themes/pluto/vendors/css/${fname}` );
}
console.log( "Skopiowano pliki CSS" );

// czcionki
for( const file of font_files )
{
	let fname = path.posix.basename( file );

	console.log( `[font] Kopiowanie pliku: ${fname}` );
	fs.copyFileSync( file, `public/themes/pluto/vendors/fonts/${fname}` );
}
console.log( "Skopiowano czcionki." );

// minimalizacja rozmiaru requirejs
// let options = {
// 	mangle  : true,
// 	compress: true,
// 	output  : {
// 		beautify: false,
// 		preamble:
// 			"/* @license RequireJS 2.3.5 " +
// 				"Copyright jQuery Foundation and other contributors.\n" +
// 			" * Released under MIT license, https://github.com/" +
// 				"requirejs/requirejs/blob/master/LICENSE\n" +
// 			" */"
// 	}
// };

// console.log( "Minimalizacja rozmiaru biblioteki RequireJS..." );
// fs.writeFileSync( "node_modules/requirejs/require.min.js",
// 	uglifyjs.minify(
// 		fs.readFileSync( "node_modules/requirejs/require.js", "utf8" ),
// 		options
// 	).code,
// 	"utf8"
// );

// czcionki
for( const file of js_files )
{
	let fname = path.posix.basename( file );

	console.log( `[font] Kopiowanie pliku: ${fname}` );
	fs.copyFileSync( file, `public/themes/pluto/vendors/js/${fname}` );
}
console.log( "Skopiowano pliki javascript." );
