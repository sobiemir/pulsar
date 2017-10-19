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

const menus = [{
	id: 1,
	id_language: 1,
	private: false,
	online: true,
	order: 1,
	name: "Menu główne"
}, {
	id: 2,
	id_language: 1,
	private: true,
	online: true,
	order: 2,
	name: "Menu systemowe"
}, {
	id: 1,
	id_language: 2,
	private: false,
	online: true,
	order: 2,
	name: "Main menu"
}, {
	id: 2,
	id_language: 2,
	private: true,
	online: true,
	order: 1,
	name: "System menu"
}, {
	id: 3,
	id_language: 2,
	private: false,
	online: false,
	order: 3,
	name: "Sidebar menu"
}, {
	id: 3,
	id_language: 3,
	private: false,
	online: false,
	order: 1,
	name: "Нижнее меню"
}, {
	id: 4,
	id_language: 2,
	private: true,
	online: false,
	order: 4,
	name: "Footer menu"
}];

module.exports = {
	// wgrywanie danych testowych
	up: (queryInterface, Sequelize) =>
	{
		let sql = queryInterface.QueryGenerator.selectQuery( "menu", {
			limit: 1
		} );
		// sprawdź czy menu są już wrzucone
		return queryInterface.sequelize.query( sql, {
			type: Sequelize.QueryTypes.SELECT,
			raw: true
		// oraz czy są dostępne odpowiednie języki
		} ).then( (data) => {
			if( data.length > 0 )
				throw "You can insert test data only to empty table."

			sql = queryInterface.QueryGenerator.selectQuery( "language", {
				where: {
					id: [1, 2, 3, 4, 5]
				}
			} );
			return queryInterface.sequelize.query( sql, {
				type: Sequelize.QueryTypes.SELECT,
				raw: true
			} );
		// jeżeli wszystko jest ok, wrzuć dane
		} ).then( (data) => {
			if( data.length != 5 )
				throw "You don't have languages needed for query.";

			return queryInterface.bulkInsert( "menu", menus );
		} );
	},

	// usuwanie danych testowych
	down: (queryInterface, Sequelize) =>
	{
		// utwórz warunki - sprawdzaj czy element zgadza się z tym wgrywanym
		const elems = [];
		for( const menu of menus )
			elems.push( queryInterface.bulkDelete("menu", {
				id: menu.id,
				id_language: menu.id_language,
				name: menu.name
			}) );
		// wykonaj wszystkie zapytania
		return Promise.all( elems );
	}
};
