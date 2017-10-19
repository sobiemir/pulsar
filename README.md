# Pulsar CMS

Issues page:
http://pm.aculo.pl/projects/pulsar/

Demo page:
http://pulsar.aculo.pl/admin/login

Login on admin:
- Username: admin
- Password: admin

Login on test:
- Username: test
- Password: test

Dependencies:
- Node.js
- Phalcon
- PHP 7
- MariaDB / PostgreSQL / SQLite

Installation:

First step is to edit your config.json file placed in pulsar/config directory.
This file will not be updated from GIT.

    npm install

    npm run tsc
    npm run sequelize db:migrate
    npm run sequelize db:seed:all

    node prepare.js
