--
--  This file is part of Pulsar CMS
--  Copyright (c) by sobiemir <sobiemir@aculo.pl>
--
--  This program is free software: you can redistribute it and/or modify
--  it under the terms of the GNU General Public License as published by
--  the Free Software Foundation, either version 3 of the License, or
--  (at your option) any later version.
--
--  This program is distributed in the hope that it will be useful,
--  but WITHOUT ANY WARRANTY; without even the implied warranty of
--  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
--  GNU General Public License for more details.
--
--  You should have received a copy of the GNU General Public License
--  along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
-- code         Skrócony kod języka.
-- frontend     Czy język jest dostępny dla użytkowników na stronie?
-- backend      Czy język jest dostępny w panelu administratora?
-- direction    Kierunek tekstu: 0 - AUTO, 1 - LTR, 2 - RTL.
-- default_name Domyślna nazwa języka gdy nie ma jej w tłumaczeniach.
-- order        Pozycja względem której wyświetlany będzie język.
-- =============================================================================
CREATE TABLE `language`
(
	`id`           BINARY(16)   NOT NULL,
	`frontend`     TINYINT(1)   NOT NULL DEFAULT 0,
	`backend`      TINYINT(1)   NOT NULL DEFAULT 0,
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
-- id      Identyfikator menu.
-- private Czy menu jest prywatne?
-- online  Czy menu jest dostępne do umieszczenia na stronie?
-- order   Pozycja menu w liście.
-- name    Nazwa menu wyświetlana w panelu administratora.
-- =============================================================================
CREATE TABLE `menu`
(
	`id`          BINARY(16)   NOT NULL,
	`id_language` BINARY(16)   NOT NULL,
	`private`     TINYINT(1)   NOT NULL DEFAULT 1,
	`online`      TINYINT(1)   NOT NULL DEFAULT 1,
	`order`       INTEGER      NOT NULL DEFAULT 0,
	`name`        VARCHAR(255) NOT NULL DEFAULT "",

	PRIMARY KEY (id, id_language),
	FOREIGN KEY (id_language) REFERENCES language (id)
);

-- -----------------------------------------------------------------------------
--
-- =============================================================================
-- PRZYKŁADOWE DANE
-- =============================================================================
--
-- -----------------------------------------------------------------------------

INSERT INTO `language` VALUES
	(UUID2BIN("9e76c39b-fb16-474d-b4aa-cf4c1ff7d441"),
		1, 1, 1, 1, "pl", "Polski"),

	(UUID2BIN("6f2b56fc-6ad5-4bbd-abac-646ed79b5cd0"),
		0, 1, 1, 2, "en", "English"),

	(UUID2BIN("5ecc2846-0b64-4595-8328-dd47cc5a5e2e"),
		1, 0, 1, 3, "ru", "Русский"),

	(UUID2BIN("78bc6fee-679a-4782-abf2-ad1e8dd20860"),
		1, 0, 1, 4, "de", "Deutsch"),

	(UUID2BIN("0b8b117e-a10a-463f-8155-d1a00196e537"),
		0, 0, 1, 5, "ko", "한국어");

INSERT INTO `menu` VALUES
	(UUID2BIN("634aa9bd-d1db-436f-b647-542d815717c1"),
		UUID2BIN("9e76c39b-fb16-474d-b4aa-cf4c1ff7d441"),
		0, 1, 1, "Menu główne"),

	(UUID2BIN("0c0ba94e-0c7a-4831-b06b-914c47deb3a6"),
		UUID2BIN("9e76c39b-fb16-474d-b4aa-cf4c1ff7d441"),
		1, 1, 2, "Menu systemowe"),

	(UUID2BIN("634aa9bd-d1db-436f-b647-542d815717c1"),
		UUID2BIN("6f2b56fc-6ad5-4bbd-abac-646ed79b5cd0"),
		0, 1, 1, "Main menu"),

	(UUID2BIN("0c0ba94e-0c7a-4831-b06b-914c47deb3a6"),
		UUID2BIN("6f2b56fc-6ad5-4bbd-abac-646ed79b5cd0"),
		1, 1, 2, "System menu");
