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

// konfiguracja RequireJS
require.config({
	baseUrl: "/themes/pluto/js",
	paths  : {
		"Application": "app.static"
	}
});

window.console.log( "RequireJS, wersja: " + require.version );
window.console.log( "Ładowanie zależności..." );

require( ["Application"], (Application) => {
	window.console.log( "Aplikacja została załadowana..." );

	var app = new Application.default();

	app.initCheckBoxes();
	app.initTabControls();
} );
