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

module.exports = {
	up: (queryInterface, Sequelize) =>
	{
		return queryInterface.createTable( "menu", {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false
			},
			id_language: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				allowNull: false,
				references: {
					model: "language",
					key: "id"
				}
			},
			private: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true
			},
			online: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true
			},
			order: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0
			},
			name: {
				type: Sequelize.STRING(255),
				allowNull: false,
				defaultValue: ""
			}
		} );
	},

	down: (queryInterface, Sequelize) =>
	{
		return queryInterface.dropTable( "menu" );
	}
};
