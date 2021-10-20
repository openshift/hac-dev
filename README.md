# HAC Developer Experience

React.js application for HAC Developer Experience built using Patternfly 4 and shared Red Hat cloud service frontend components. This application integrates into cloud.redhat.com using Webpack 5 module federation.

HAC Developer Experience will deliver the UI for App Studio.

## Getting started

### Run with webpack proxy

1. ```npm install```

2. ```npm run start:beta:ci```

3. Open the URL listed in the terminal output.


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


## Architecture

This repo's source code builds a static React app to be served on https://cloud.redhat.com.

The React app bundled using [Webpack](https://webpack.js.org) includes:
  - [@patternfly/react-core](https://github.com/patternfly/patternfly-react) as the component library
  - A [react-router-dom BrowserRouter](https://reacttraining.com/react-router/web/api/BrowserRouter) for routing pages
    - Uses the HTML5 history API (pushState, replaceState and the popstate event) to keep UI in sync with the URL
  - [React-redux](https://github.com/reactjs/react-redux) for managing global state (usually for API calls)
    - There is helper function used to create store with option to plug reducers on the fly called [getRegistry](https://github.com/RedHatInsights/frontend-components/blob/master/packages/utils/doc/redux.md#reducer-registry)
    - @redhat-cloud-services/frontend-components-notifications/redux is provided for chromed notifications
  - [React.lazy and React.Suspense](https://reactjs.org/docs/code-splitting.html#reactlazy) for asynchronously loading components

These assets are loaded via [Insights chrome](https://github.com/RedHatInsights/insights-chrome) which provides user auth, top and side nav (aka chroming), and a `<main id="root">` to inject into.

### Webpack

This repo uses a [shared common config](https://www.npmjs.com/package/@redhat-cloud-services/frontend-components-config) with sensible defaults to build and run your application.

This repo uses [federated modules](https://webpack.js.org/concepts/module-federation/) to seamlessly load multiple applications at runtime.



