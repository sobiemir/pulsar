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
 * Tworzy tabelę z językami strony.
 * 
 * Lista języków dostepnych na stronie i/lub dla panelu administratora.
 * Informacje o zasadach odnośnie zapisu kodu języka można znaleźć pod adresem:
 * https://www.w3.org/International/articles/language-tags/
 */
module.exports = {
	up: ( queryInterface, Sequelize ) => {
		return queryInterface.createTable( "language", {
			id: {
				type: Sequelize.CHAR(16).BINARY,
				primaryKey: true,
				allowNull: false
			},
			frontend: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0
			},
			backend: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0
			},
			direction: {
				type: Sequelize.CHAR(1),
				allowNull: false,
				defaultValue: 'L'
			},
			order: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0
			},
			code: {
				type: Sequelize.STRING(20),
				allowNull: false,
				defaultValue: "pl",
				unique: true
			},
			default_name: {
				type: Sequelize.STRING(100),
				allowNull: false,
				defaultValue: "polski"
			}
		} );
	},

	down: ( queryInterface, Sequelize ) => {
		return queryInterface.dropTable( "language" );
	}
};
