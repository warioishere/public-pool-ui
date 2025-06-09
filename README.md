# The Blitzpool UI project is an Angular application for viewing and controlling a Bitcoin mining pool. New additions include:

-BTC address management: Users can add multiple BTC addresses, switch between them, and remove them via the settings view
-New totalshares Count and Shares per worker fetched from a new Endpoint on our Blitzpool backend.
-Customizable UI options: Settings allow toggling background particles and the visibility of several dashboard cards (best difficulty, total shares, network difficulty, network hashrate, block height)
-Additional components and graphs: There are dedicated worker and worker-group pages, as well as a mining hashrate graph, all integrated through the routing module
-Splash page improvements: The landing page now presents current network statistics, donation capabilities through BTCPay, contact links, and displays running version information

Overall, Blitzpool UI offers a customizable dashboard that tracks mining performance and provides user address management.

# Blitzpool UI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.3.

## Dependencies

Requires [Public-Pool](https://github.com/benjamin-wilson/public-pool) to be running

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Deployment

Install pm2 (https://pm2.keymetrics.io/)

```bash
$ pm2 serve --spa dist/public-pool-ui/ 3335 --name ui
```

## Docker

```bash
$ docker build -t public-pool-ui .
$ docker run --name public-pool-ui --rm -p 8080:80 public-pool-ui
```

From Docker commands, website will be accessible on [http://localhost:8080](http://localhost:8080). By default Caddy server listen on port 80, but we bind it to port 8080 which allows you to launch image without root permissions.

Available variables:
* `DOMAIN`: website domain (default: `localhost`)
* `LOGLEVEL`: loglevel in stdout (default: `INFO`)
* `LOGFORMAT`: log format in stdout (default: `json`)

The Blitzpool UI is based on the original Public-Pool UI from Benjamin Wilson, see:
https://github.com/benjamin-wilson/public-pool
