# Portmon (portmon)

Bills sharing

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```


### Build the app for production
```bash
quasar build --mode pwa
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).


### TODO
## development

person je soucasti eventu

Pri editaci persony moznost editovat vsechny persony ???

persons into events
neresim Add/remove, ale spis Import from other events


Sync
----
Kazdy event ma URL view

Uzivatele (email/password)
maji prirazene eventy s ACL view/edit


1. person => event

2. express server


export const schema = {
events: '    ++id, server_id, server_ts, client_ts, name, description, opened',
currencies: '++id, server_id, server_ts, client_ts, event_id, code, unit, ratio, reversed, base',
persons: '   ++id, server_id, server_ts, client_ts, event_id, forename, surname, email, phone, account',
entries: '   ++id, server_id, server_ts, client_ts, event_id, date, description, amount, currency, *payers, *receivers'
};
m
