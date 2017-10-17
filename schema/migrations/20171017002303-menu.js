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
 * Tworzy tabelę dla menu.
 * 
 * Do menu przypisywane są strony, do których zaś przypinane są artykuły.
 * Menu można podpiąć do wybranego kontenera na stronie.
 * Istnieją również prywatne menu które nie mogą być wybrane i wyświetlane.
 * Domyślne utworzone prywatne menu systemowe, to menu ze stronami błędów.
 * Każde utworzone menu można wyłączyć przełączając pole "online".
 */
module.exports = {
	up: ( queryInterface, Sequelize ) => {
		return queryInterface.createTable( "menu", {
			id: {
				type: Sequelize.CHAR(16).BINARY,
				primaryKey: true,
				allowNull: false
			},
			id_language: {
				type: Sequelize.CHAR(16).BINARY,
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

	down: ( queryInterface, Sequelize ) => {
		return queryInterface.dropTable( "menu" );
	}
};
