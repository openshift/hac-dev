# HAC Developer Experience

React.js application for HAC Developer Experience built using Patternfly 4 and shared Red Hat cloud service frontend components. This application integrates into cloud.redhat.com using Webpack 5 module federation.

HAC Developer Experience will deliver the UI for App Studio.

## Getting started

### Run with webpack proxy

First, install the npm dependencies with `npm install`.

For connecting to the stage environment, create the file `config/.env.local` with the contents
below. Otherwise, skip this step.

 ```bash
 REGISTRATION_URL=https://registration-service-toolchain-host-operator.apps.stone-stg-host.qc0p.p1.openshiftapps.com
 PROXY_URL=https://api-toolchain-host-operator.apps.stone-stg-host.qc0p.p1.openshiftapps.com
 PROXY_WEBSOCKET_URL=wss://api-toolchain-host-operator.apps.stone-stg-host.qc0p.p1.openshiftapps.com
 ```

Finally, execute `npm run start:prod:beta` to start the proxy.

Use the URL listed in the terminal output.

### Update `/etc/hosts`

To use webpack proxy you need to append this to your `/etc/hosts` for auth:

```
127.0.0.1 prod.foo.redhat.com
127.0.0.1 stage.foo.redhat.com
127.0.0.1 qa.foo.redhat.com
127.0.0.1 ci.foo.redhat.com
```

### Testing

`npm run verify` will run `npm run lint` (eslint) and `npm test` (Jest)


## Contributing
We encourage public contributions! Please review [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our code of conduct and development process.

## Further Reading
- **[ARCHITECTURE](docs/ARCHITECTURE.md)**
- **[STYLEGUIDE](docs/STYLEGUIDE.md)**
- **[OWNERS](OWNERS)**

