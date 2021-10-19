# HAC Developer Experience

React.js application for HAC Developer Experience built using Patternfly 4 and shared Red Hat cloud service frontend components. This application integrates into cloud.redhat.com using Webpack 5 module federation.

HAC Developer Experience will deliver the UI for App Studio.

## Getting started

You can choose from either webpack proxy (simple to use) or more config heavy legacy insights-proxy

### Run with webpack proxy

1. ```npm install```

2. ```npm run start:proxy:beta:ci```

3. Open browser using the URL listed in the terminal output.


### Run with insights proxy

[Insights Proxy](https://github.com/RedHatInsights/insights-proxy) is optional to run the hac-core frontend application.
```
SPANDX_CONFIG="$(pwd)/hac-core-frontend/profiles/local-frontend.js" bash insights-proxy/scripts/run.sh
```

Open new terminal and run the app

1. ```npm install```

2. ```npm run start```
    - starts webpack bundler and serves the files with webpack dev server

### Testing

`npm run verify` will run `npm run lint` (eslint) and `npm test` (Jest)

