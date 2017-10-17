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

/**
 * Tworzy tabelę dla użytkowników.
 * 
 * Na chwilę obecną jest to prosta lista pól które są obowiązkowe dla każdego
 * użytkownika.
 */
module.exports = {
	up: ( queryInterface, Sequelize ) => {
		return queryInterface.createTable( "user", {
			id: {
				type: Sequelize.CHAR(16).BINARY,
				primaryKey: true,
				allowNull: false
			},
			username: {
				type: Sequelize.STRING(50),
				allowNull: false,
				unique: true
			},
			screen_name: {
				type: Sequelize.STRING(70),
				allowNull: false,
				unique: true
			},
			email: {
				type: Sequelize.STRING(100),
				allowNull: false,
				unique: true
			},
			password: {
				type: Sequelize.STRING(255),
				allowNull: false
			},
			join_date: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.NOW
			},
			status: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0
			}
		} );
	},

	down: ( queryInterface, Sequelize ) => {
		return queryInterface.dropTable( "user" );
	}
};
