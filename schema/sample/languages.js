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

const languages = [{
	id: 1,
	frontend: true,
	backend: true,
	direction: "L",
	order: 1,
	code: "pl",
	default_name: "Polski"
}, {
	id: 2,
	frontend: true,
	backend: true,
	direction: "L",
	order: 2,
	code: "en",
	default_name: "English"
}, {
	id: 3,
	frontend: true,
	backend: false,
	direction: "L",
	order: 3,
	code: "ru",
	default_name: "Русский"
}, {
	id: 4,
	frontend: false,
	backend: true,
	direction: "L",
	order: 4,
	code: "de",
	default_name: "Deutsch"
}, {
	id: 5,
	frontend: false,
	backend: false,
	direction: "L",
	order: 5,
	code: "ko",
	default_name: "한국어"
}];

module.exports = {
	// wgrywanie danych testowych
	up: (queryInterface, Sequelize) =>
	{
		// utwórz zapytanie sprawdzające czy istnieją już jakieś dane w tabeli
		let sql = queryInterface.QueryGenerator.selectQuery( "language", {
			limit: 1
		} );
		// i wykonaj je
		return queryInterface.sequelize.query( sql, {
			type: Sequelize.QueryTypes.SELECT,
			raw: true
		} ).then( (data) => {
			// jeżeli istnieją, zwróć wyjątek
			if( data.length > 0 )
				throw "You can insert test data only to empty table."

			// jeżeli nie, wgraj dane testowe
			return queryInterface.bulkInsert( "language", languages );
		} );
	},

	// usuwanie danych testowych
	down: (queryInterface, Sequelize) =>
	{
		// utwórz warunki - sprawdzaj czy element zgadza się z tym wgrywanym
		const elems = [];
		for( const language of languages )
			elems.push( queryInterface.bulkDelete("language", {
				"id": language.id,
				"code": language.code,
				"default_name": language.default_name
			}) );
		// wykonaj wszystkie zapytania
		return Promise.all( elems );
	}
};
