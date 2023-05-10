# HAC Developer Experience

React.js application for HAC Developer Experience built using Patternfly 4 and shared Red Hat cloud service frontend components. This application integrates into cloud.redhat.com using Webpack 5 module federation.

HAC Developer Experience will deliver the UI for App Studio.

## Getting started

### Run with webpack proxy

1. ```npm install```

2. For devsandbox - ```npm run start:prod:beta```
   
3. For KCP - ```npm run start:prod:beta:kcp```

4. Open the URL listed in the terminal output.


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

### Running E2E Tests on PR
To initiate the E2E test execution process on pull requests : 
- By default, a **basic E2E test suite** execution is automatically triggered when a pull request is raised.
- To initiate a **basic E2E test suite** execution manually, comment `/retest` on the pull request.
- To initiate the **entire E2E test suite** execution manually, comment `[test]` on the pull request.
    - Although running the entire E2E test suite is optional, it is **recommended** to do so when significant UI changes have been made.

## Contributing
We encourage public contributions! Please review [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our code of conduct and development process.

## Further Reading
- **[ARCHITECTURE](docs/ARCHITECTURE.md)**
- **[STYLEGUIDE](docs/STYLEGUIDE.md)**
- **[OWNERS](OWNERS)**





