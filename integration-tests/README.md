# HAC AppStudio Integration tests

## Getting started

### Run tests
Prerequisites:
* Access to AppStudio cluster 
* (for cleaning namespace before/after test run) Set up kubelogin with appstudio cluster credentials

Run `npm run start:prod:beta`, then `../node_modules/.bin/cypress run --env USERNAME=<USERNAME>,PASSWORD=<PASSWORD>` and change USERNAME and PASSWORD or open cypress `npx cypress open` and run tests from GUI (you need to update username and password in integration-tests/plugins/index.ts).

You can also use more variables - see the table below:
| Environment Variable | Description | Default value | Example |
| -- | -- | -- | -- |
| `HAC_BASE_URL` | Base URL for testing | 'https://prod.foo.redhat.com:1337/beta/hac/app-studio' | HAC_BASE_URL=https://prod.foo.redhat.com:1337/hac/app-studio |
| `USERNAME` | Username for testing (SSO) | '' |  USERNAME=admin |
| `PASSWORD` | Password for testing (SSO) | '' | PASSWORD=adminPassword |
| `KUBECONFIG` | Kubeconfig for cleaning namespace | '/home/user/.kube/appstudio-config' | KUBECONFIG=/home/user/kube/config |
| `CLEAN_NAMESPACE` | Clean namespace | 'false' | CLEAN_NAMESPACE = 'true' |
