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
