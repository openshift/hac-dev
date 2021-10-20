# HAC Developer Experience

React.js application for HAC Developer Experience built using Patternfly 4 and shared Red Hat cloud service frontend components. This application integrates into cloud.redhat.com using Webpack 5 module federation.

HAC Developer Experience will deliver the UI for App Studio.

## Getting started

### Run with webpack proxy

1. ```npm install```

2. ```npm run start:proxy:beta:ci```

3. Open browser using the URL listed in the terminal output.


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

