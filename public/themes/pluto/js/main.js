/*
 *  This file is part of Pulsar CMS
 *  Copyright (c) by sobiemir <sobiemir@aculo.pl>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// konfiguracja RequireJS
require.config({
	baseUrl: "/themes/pluto/js",
	paths  : {
		jquery    : "lib/jquery",
		underscore: "lib/underscore",
		backbone  : "lib/backbone",
		bootstrap : "bootstrap",
		text      : "lib/text.require",
		css       : "lib/css.require"
	}
});

window.console.log( "RequireJS, wersja: " + require.version );
window.console.log( "Ładowanie zależności..." );

let loadInfo = document.getElementById( "qp-i" );
let loadFile = 0;
let filesCnt = 7;

/**
 * Funkcja zwiększająca szerokość paska postępu.
 * Używana przy dynamicznym ładowaniu strony.
 * 
 * @return {void}
 */
window.increaseLoadingProgress = () => {
	loadFile++;
	loadInfo.style.width = ((loadFile / filesCnt) * 100) + "%";

	if( loadFile === filesCnt )
		window.$("#qp-p").animate( {opacity:0}, 300, () => {
			window.$("#loading-screen").fadeOut( 300 );
		} );
};

// ładowanie zależności dla CSS i JavaScript
require( ["jquery"], ($) => {
	window.increaseLoadingProgress();

	require( ["css!../css/admin"], () => {
		window.increaseLoadingProgress();
		
		require( ["css!../css/font-awesome"], () => {
			window.increaseLoadingProgress();

			require( ["underscore"], (_) => {
				window.increaseLoadingProgress();

				require( ["backbone"], (Backbone) => {
					window.increaseLoadingProgress();

					require( ["bootstrap"], (Bootstrap) => {
						window.increaseLoadingProgress();
						window.console.log( "Załadowano plik startowy..." );

						let bootstrap = new Bootstrap.default();

						bootstrap.setStartPage( "index", "index" );
						bootstrap.start();
					} );
					window.console.log( "Załadowano Backbone, wersja: " + Backbone.VERSION );
				} );
				window.console.log( "Załadowano Underscore, wersja: " + _.VERSION );
			} );
			window.console.log( "Załadowano FontAwesome." );
		});
		window.console.log( "Załadowano kaskadowy arkusz styli." );
	});
	window.console.log( "Załadowano jQuery, wersja: " + $.fn.jquery );
} );
