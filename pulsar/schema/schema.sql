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

DROP FUNCTION IF EXISTS UUID2BIN;

CREATE FUNCTION UUID2BIN(s CHAR(36))
	RETURNS binary(16)
	DETERMINISTIC

	RETURN UNHEX(CONCAT(
		SUBSTRING(s,7,2),SUBSTRING(s,5,2),SUBSTRING(s,3,2),SUBSTRING(s,1,2),
		SUBSTRING(s,12,2),SUBSTRING(s,10,2),
		SUBSTRING(s,17,2),SUBSTRING(s,15,2),
		SUBSTRING(s,20,4),
		SUBSTRING(s,25,12)
	)
);

DROP TABLE IF EXISTS `menu`;
DROP TABLE IF EXISTS `language`;
DROP TABLE IF EXISTS `user`;

-- DOSTĘPNE JĘZYKI
-- =============================================================================
-- Lista języków dostepnych na stronie i/lub dla panelu administratora.
-- Tłumaczenia dla elementów dynamicznych dostępne są w osobnych tabelach.
-- Elementy statyczne zawierają tłumaczenia w plikach.
-- Użytkownik może definiować również kod języka, informacje o zasadach
-- odnośnie kodu języka można znaleźć pod adresem:
-- https://www.w3.org/International/articles/language-tags/
--
-- id           Identyfikator języka.
-- frontend     Czy język jest dostępny dla użytkowników na stronie?
-- backend      Czy język jest dostępny w panelu administratora?
-- direction    Kierunek tekstu: 0 - AUTO, 1 - LTR, 2 - RTL.
-- order        Pozycja względem której wyświetlany będzie język.
-- code         Skrócony kod języka.
-- default_name Domyślna nazwa języka gdy nie ma jej w tłumaczeniach.
-- =============================================================================
CREATE TABLE `language`
(
	`id`           BINARY(16)   NOT NULL,
	`frontend`     BOOLEAN      NOT NULL DEFAULT 0,
	`backend`      BOOLEAN      NOT NULL DEFAULT 0,
	`direction`    TINYINT(1)   NOT NULL DEFAULT 1,
	`order`        INTEGER      NOT NULL DEFAULT 0,
	`code`         VARCHAR(20)  NOT NULL DEFAULT "pl",
	`default_name` VARCHAR(100) NOT NULL DEFAULT "polski",

	PRIMARY KEY(`id`),
	UNIQUE  KEY(`code`)
);

-- LISTA DOSTĘPNYCH MENU
-- =============================================================================
-- Do menu przypisywane są strony, do których zaś przypinane są artykuły.
-- Menu można podpiąć do wybranego kontenera na stronie.
-- Istnieją również prywatne menu które nie mogą być wybrane i wyświetlane.
-- Domyślne utworzone prywatne menu systemowe, to menu ze stronami błędów.
-- Każde utworzone menu można wyłączyć przełączając pole "online".
--
-- id          Identyfikator menu.
-- id_language Identyfikator języka na które tłumaczone jest menu.
-- private     Czy menu jest prywatne?
-- online      Czy menu jest dostępne do umieszczenia na stronie?
-- order       Pozycja menu w liście.
-- name        Nazwa menu wyświetlana w panelu administratora.
-- =============================================================================
CREATE TABLE `menu`
(
	`id`          BINARY(16)   NOT NULL,
	`id_language` BINARY(16)   NOT NULL,
	`private`     BOOLEAN      NOT NULL DEFAULT 1,
	`online`      BOOLEAN      NOT NULL DEFAULT 1,
	`order`       INTEGER      NOT NULL DEFAULT 0,
	`name`        VARCHAR(255) NOT NULL DEFAULT "",

	PRIMARY KEY (`id`, `id_language`),
	FOREIGN KEY (`id_language`) REFERENCES `language` (`id`)
);

-- LISTA ZAREJESTROWANYCH UŻYTKOWNIKÓW
-- =============================================================================
-- Na chwilę obecną jest to prosta lista pól które są obowiązkowe dla każdego
-- użytkownika.
-- Tabela ta będzie ewentualnie rozszerzana przez inną tabelę modyfikowaną
-- z poziomu aplikacji (użytkownik będzie mógł dodawać i usuwać pola).
-- 
-- id           Identyfikator użytkownika.
-- username     Nazwa użytkownika po której użytkownik będzie się logował.
-- screen_name  Wyświetlana nazwa użytkownika.
-- email        Adres email użytkownika.
-- password     Hasło przepuszczone przez funkcję haszującą.
-- join_date    Data rejestracji użytkownika.
-- status       Status użytkownika (np. aktywny / nieaktywny / zbanowany itp).
-- =============================================================================
CREATE TABLE `user`
(
	`id`           BINARY(16)   NOT NULL,
	`username`     VARCHAR(50)  NOT NULL,
	`screen_name`  VARCHAR(50)  NOT NULL,
	`email`        VARCHAR(100) NOT NULL,
	`password`     VARCHAR(255) NOT NULL,
	`join_date`    DATETIME     NOT NULL DEFAULT NOW(),
	`status`       INTEGER      NOT NULL DEFAULT 0,

	PRIMARY KEY (`id`),
	UNIQUE  KEY (`username`),
	UNIQUE  KEY (`email`)
);

-- =============================================================================
-- PRZYKŁADOWE DANE
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
