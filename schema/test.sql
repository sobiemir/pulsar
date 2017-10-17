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
	(UUID2BIN("e123ef97-50be-4641-a3a0-b36bc41e1894"),
		"admin", "Mr. Admin", "admin@test.site",
		"$2y$10$N0VLcURMV2d5OGdpVk1UV.1gSpUmKuHQcAM/VLn.1cXbYAC7HeGUK",
		NOW(), 1),

	(UUID2BIN("5e77bedd-0557-4093-9ea9-593d1192641d"),
		"test", "Ms. Test", "test@test.site",
		"$2y$10$RDR0cXM1eWRaU3ZuM2U4aeSVmhsByokNIIHBTD1JGgpVaW09BE.4q",
		NOW(), 0);

-- JĘZYKI
-- =============================================================================
INSERT INTO `language` VALUES
	(UUID2BIN("9e76c39b-fb16-474d-b4aa-cf4c1ff7d441"),
		TRUE, TRUE, 1, 1, "pl", "Polski"),

	(UUID2BIN("6f2b56fc-6ad5-4bbd-abac-646ed79b5cd0"),
		TRUE, TRUE, 1, 2, "en", "English"),

	(UUID2BIN("5ecc2846-0b64-4595-8328-dd47cc5a5e2e"),
		TRUE, FALSE, 1, 3, "ru", "Русский"),

	(UUID2BIN("78bc6fee-679a-4782-abf2-ad1e8dd20860"),
		FALSE, TRUE, 1, 4, "de", "Deutsch"),

	(UUID2BIN("0b8b117e-a10a-463f-8155-d1a00196e537"),
		FALSE, FALSE, 1, 5, "ko", "한국어");

-- MENU
-- =============================================================================
INSERT INTO `menu` VALUES
	(UUID2BIN("634aa9bd-d1db-436f-b647-542d815717c1"),
		UUID2BIN("9e76c39b-fb16-474d-b4aa-cf4c1ff7d441"),
		FALSE, TRUE, 1, "Menu główne"),

	(UUID2BIN("0c0ba94e-0c7a-4831-b06b-914c47deb3a6"),
		UUID2BIN("9e76c39b-fb16-474d-b4aa-cf4c1ff7d441"),
		TRUE, TRUE, 2, "Menu systemowe"),

	(UUID2BIN("634aa9bd-d1db-436f-b647-542d815717c1"),
		UUID2BIN("6f2b56fc-6ad5-4bbd-abac-646ed79b5cd0"),
		FALSE, TRUE, 1, "Main menu"),

	(UUID2BIN("0c0ba94e-0c7a-4831-b06b-914c47deb3a6"),
		UUID2BIN("6f2b56fc-6ad5-4bbd-abac-646ed79b5cd0"),
		TRUE, TRUE, 2, "System menu"),

	(UUID2BIN("7dc7f931-4e5a-474f-a289-dd794b34f099"),
		UUID2BIN("6f2b56fc-6ad5-4bbd-abac-646ed79b5cd0"),
		FALSE, FALSE, 3, "Sidebar menu"),

	(UUID2BIN("e98e4071-9b11-41a8-837f-a797b80bb72d"),
		UUID2BIN("5ecc2846-0b64-4595-8328-dd47cc5a5e2e"),
		FALSE, FALSE, 1, "Нижнее меню"),

	(UUID2BIN("e98e4071-9b11-41a8-837f-a797b80bb72d"),
		UUID2BIN("6f2b56fc-6ad5-4bbd-abac-646ed79b5cd0"),
		TRUE, FALSE, 4, "Footer menu");
