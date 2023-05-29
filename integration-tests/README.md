# HAC UI Tests
Functional tests using [Cypress](https://docs.cypress.io/guides/overview/why-cypress)

## What can be found here
The important bits are as follows:

| Path | Description |
| -- | -- |
| `cypress.config.ts` | cypress configuration file, contains all the environment and plugin setup |
| `support` | contains helper files for cypress, like hooks, custom commands, page objects or plugin integration |
| `tests` | the actual spec files reside here |
| `utils` | utilities for easier test development, from UI interaction tasks to network requests |
| `cypress` | test results, including screenshots, video recordings, HTML reports, xunit files, etc. |

## Running the tests locally
Prerequisites:
* Nodejs (any version that is not pre-historical will do)
* Access (credentials) to running RHTAP instance  
* Github token for the `advanced-happy-path` spec (can be obtained from openshift-ci vault for hac-dev, contact `jrichter` for access)

Certain environment variables will need to be set up, depending on what you intend to run. The most convenient way is to export them from the CLI, in which case they need to be prefixed with `CYPRESS_`, e.g. `USERNAME` is set as `export CYPRESS_USERNAME=username`. Alternatively, they can be passed to cypress via `-e` flag, e.g `npx cypress run -e USERNAME=username`.

Find the supported variables in the table below:
| Variable name | Description | Required | Default Value |
| -- | -- | -- | -- |
| `HAC_BASE_URL` | The URL to the main page of RHTAP UI | Yes | 'https://prod.foo.redhat.com:1337/beta/hac/application-pipeline' |
| `USERNAME` | Username for SSO login | Yes | '' |
| `PASSWORD` | Password for SSO login | Yes | '' |
| `PR_CHECK` | Assume the test is a PR check, enable report portal, assume keycloak is used instead of RH-SSO | For PR checks | false |
| `PERIODIC_RUN` | Assume the test is a nightly run, keycloak is used instead of RH-SSO | For runs using ephemeral RHTAP environment | false |
| `REMOVE_APP_ON_FAIL` | Clean up applications from the cluster even if tests fail | No | false |
| `GH_TOKEN` | Github token for network requests | For the `advanced` spec | '' |
| |
| `RP_TOKEN` | Report portal token for PR checks | No | '' |
| `GH_PR_TITLE` | Report portal setup | No | '' |
| `GH_PR_LINK` | Report portal setup | No | '' |

### Running from source
This is the recommended way when either developing tests, or a headed test runner is preferred. After running `npm install` and setting the appropriate environment variables, use one of the following commands to run cypress.

For the headed test runner:
```
$ npx cypress open
```
Select E2E testing and the browser of your choice (chrome is recommended though), then launch any spec by clicking it in the list, and watch as it runs.

For headless execution:
```
$ npx cypress run
```
Runs all available specs, by default in the Electron browser. Flags that might come in handy are `-b` to specify the browser, or `-s` to filter spec files based on a glob pattern. For example, running the basic happy path spec in chrome:
```
$ npx cypress run -b chrome -s 'tests/basic-happy-path*'
```

### Running using docker image
This folder contains a Dockerfile that specifies an image with all the dependencies and test code included. It should be available on quay.io and should be updated no more than 30 minutes after a change is pushed to this folder.

If there are no changes in your local test code, you can pull and run the image from quay, providing the required environment variables. Feel free to use docker or podman, we will be using podman in this example:
```
$ podman run quay.io/hacdev/hac-tests:next -e CYPRESS_HAC_BASE_URL=https://<HOSTNAME>/hac/application-pipeline -e CYPRESS_USERNAME="user1" -e CYPRESS_PASSWORD="user1"
```

Since the image already contains all the test code, in case you'd like to run the tests with your local changes, you would need to mount the local code:
```
$ podman run quay.io/hacdev/hac-tests:next -v <path to integration-tests>:/e2e:Z -e CYPRESS_HAC_BASE_URL=https://<HOSTNAME>/hac/application-pipeline -e CYPRESS_USERNAME="user1" -e CYPRESS_PASSWORD="user1"
```
The entrypoint searches for any code within `/e2e` path and runs it instead of any code that was already present inside the image.

#### Accessing test results
Test artifacts (reports, screenshots, videos, etc.) are only accessible to the host system if the appropriate container folder is mounted.

When running with local test code mounted, with the `-v <path to integration-tests>:/e2e:Z` option, all the test artifacts are available to the host at `<path to integration-tests>/cypress`.

When running the container with the included test code, the tests artifacts are available inside the container at `/tmp/artifacts`. Mouning the folder, the host can then access the artifacts at the `<chosen path>`:
```
$ podman run -v <chosen path>:/tmp/artifacts:Z quay.io/hacdev/hac-tests:next <environment variables>
```

#### Building the image
To build the image locally, navigate to this folder and run (using your favorite container runtime)
```
$ podman build -f Dockerfile -t <awesome tag>
```

#### Publishing the image
The image is being published automatically after a change to this folder is pushed to main. If however, the need arises to publish it manually, you will first need access to the `quay.io/hacdev/hac-tests` repository, ask `jrichter`, `kfoniok`, or `skhileri` for rights. 

Of course we will now need to build the image with the appropriate tag and push it (after logging in):
```
$ podman build -f Dockerfile -t quay.io/hacdev/hac-tests:next
$ podman login -u="$USERNAME" -p="$TOKEN" quay.io
$ podman push quay.io/hacdev/hac-tests:next
```

## Tests on CI
For CI we are using a dual cluster setup. The frontend is deployed per run on an ephemeral cluster using `bonfire`, and generally only lives as long as the CI run is active. The backend RHTAP runs on an [OSD cluster](https://console-openshift-console.apps.hac-devsandbox.5unc.p1.openshiftapps.com/dashboards) that we maintain and keep up to date with the latest RHTAP. For access to our CI cluster, contact `kfoniok`. The backend configuration can be found in our [fork of infra-deployments](https://github.com/redhat-hac-qe/infra-deployments).

The two clusters communicate through a proxy. The frontend SSO url is also replaced with a url to a keycloak instance running on the CI cluster. For each CI run, a new user is generated and registered in the toolchain host operator.

Finally, the tests are run using the `quay.io/hacdev/hac-tests:next` image.

For step-by-step setup, refer to the [pr_check.sh](../pr_check.sh) file.

### PR checks
Our Cypress tests run on every pull request, using a [jenkins job](https://ci.int.devshift.net/job/openshift-hac-dev-pr-check/) (VPN required). The job runs the aforementioned `pr_check.sh` file. Note that even though the job exposes all results generated by the tests, the HTML report will not open properly, unless downloaded, due to javascript restrictions on the jenkins instance.

By default, the `advanced-happy-path` spec file (component with custom build pipeline) is skipped for PR checks, due to long run time (~20 minutes). To run the full suite of tests, comment `[test]` on the PR. To rerun the default suite, comment `/retest`.

The job also uploads results to the RHTAP QE [report portal](https://reportportal-appstudio-qe.apps.ocp-c1.prod.psi.redhat.com/ui/#hac-dev) (ask `jrichter` for access if interested).

### Periodic tests
Additionally, the tests also run nightly on openshift-ci. Unlike the PR check, this job always runs the entire test suite.

The job history can be found [here](https://prow.ci.openshift.org/job-history/gs/origin-ci-test/logs/periodic-ci-openshift-hac-dev-main-periodic-tests), the job definition is available [here](https://github.com/openshift/release/tree/master/ci-operator/step-registry/openshift/hac-dev/e2e).

The test results will also be reported on the `#forum-rhtap-test-execution-alerts` slack channel.

### Infra-deployments PR checks
The upstream infra-deployments [repo](https://github.com/redhat-appstudio/infra-deployments) is also starting to incorporate our cypress tests in their PR checks to test new backend changes against our frontend. Currently, the `basic-happy-path` spec is being used.

Job history is available [here](https://prow.ci.openshift.org/job-history/gs/origin-ci-test/pr-logs/directory/pull-ci-redhat-appstudio-infra-deployments-main-appstudio-hac-e2e-tests).

## Reporting issues
If you find a problem with the tests, feel free to open an issue at the [HAC Jira project](https://issues.redhat.com/projects/HAC). Make sure the component field is set to `developer` and label it as `qe`.

If you discover a production bug thanks to a test failure, please label any issue created for that bug as `ci-fail`. That way we can see all this automation has actually generated some value.