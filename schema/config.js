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

const config = require( "../pulsar/config/config.json" );

// sprawdź czy istnieje wpis bazy danych w konfiguracji
if( !config )
	config = {};
// jeżeli nie, utwórz bazę na sqlite
if( !("database" in config) )
	config.database = {
		"dialect": "sqlite",
		"database": "pleiad.sqlite"
	};

module.exports = {
	development: config.database,
	test: config.database,
	production: config.database
};
