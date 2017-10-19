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

const users = [{
	id: 1,
	username: "admin",
	screen_name: "Mr. Admin",
	email: "admin@test.site",
	password: "$2y$10$N0VLcURMV2d5OGdpVk1UV.1gSpUmKuHQcAM/VLn.1cXbYAC7HeGUK",
	join_date: null,
	status: 1
}, {
	id: 2,
	username: "test",
	screen_name: "Ms. Test",
	email: "test@test.site",
	password: "$2y$10$RDR0cXM1eWRaU3ZuM2U4aeSVmhsByokNIIHBTD1JGgpVaW09BE.4q",
	join_date: null,
	status: 0
}];

module.exports = {
	// wgrywanie danych testowych
	up: (queryInterface, Sequelize) =>
	{
		let sql = queryInterface.QueryGenerator.selectQuery( "user", {
			limit: 1
		} );
		return queryInterface.sequelize.query( sql, {
			type: Sequelize.QueryTypes.SELECT,
			raw: true
		} ).then( (data) => {
			if( data.length > 0 )
				throw "You can insert test data only to empty table."

			// aktualna data dołączenia użytkownika
			for( const user of users )
				user.join_date = queryInterface.sequelize.fn( "NOW" );

			return queryInterface.bulkInsert( "user", users );
		} );
	},

	// usuwanie danych testowych
	down: (queryInterface, Sequelize) =>
	{
		// utwórz warunki - sprawdzaj czy element zgadza się z tym wgrywanym
		const elems = [];
		for( const user of users )
			elems.push( queryInterface.bulkDelete("user", {
				id: user.id,
				username: user.username,
				screen_name: user.screen_name,
				email: user.email
			}) );
		// wykonaj wszystkie zapytania
		return Promise.all( elems );
	}
};
