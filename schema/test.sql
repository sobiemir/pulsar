--
--  This file is part of Pulsar CMS
--  Copyright (c) by sobiemir <sobiemir@aculo.pl>
--     ___       __            
--    / _ \__ __/ /__ ___ _____
--   / ___/ // / (_-</ _ `/ __/
--  /_/   \_,_/_/___/\_,_/_/
--
--  This source file is subject to the New BSD License that is bundled
--  with this package in the file LICENSE.txt.
--
--  You should have received a copy of the New BSD License along with
--  this program. If not, see <http://www.licenses.aculo.pl/>.
--

-- UŻYTKOWNICY
-- =============================================================================
INSERT INTO `user` VALUES
	(1, "admin", "Mr. Admin", "admin@test.site",
		"$2y$10$N0VLcURMV2d5OGdpVk1UV.1gSpUmKuHQcAM/VLn.1cXbYAC7HeGUK",
		NOW(), 1),

	(2, "test", "Ms. Test", "test@test.site",
		"$2y$10$RDR0cXM1eWRaU3ZuM2U4aeSVmhsByokNIIHBTD1JGgpVaW09BE.4q",
		NOW(), 0);

-- JĘZYKI
-- =============================================================================
INSERT INTO `language` VALUES
	(1, TRUE,  TRUE,  'L', 1, "pl", "Polski"),
	(2, TRUE,  TRUE,  'L', 2, "en", "English"),
	(3, TRUE,  FALSE, 'L', 3, "ru", "Русский"),
	(4, FALSE, TRUE,  'L', 4, "de", "Deutsch"),
	(5, FALSE, FALSE, 'L', 5, "ko", "한국어");

-- MENU
-- =============================================================================
INSERT INTO `menu` VALUES
	(1, 1, FALSE, TRUE,  1, "Menu główne"),
	(2, 1, TRUE,  TRUE,  2, "Menu systemowe"),
	(1, 2, FALSE, TRUE,  1, "Main menu"),
	(2, 2, TRUE,  TRUE,  2, "System menu"),
	(3, 2, FALSE, FALSE, 3, "Sidebar menu"),
	(3, 3, FALSE, FALSE, 1, "Нижнее меню"),
	(4, 2, TRUE,  FALSE, 4, "Footer menu");
