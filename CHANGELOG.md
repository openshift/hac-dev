# Changelog

## [0.1.0](https://github.com/openshift/hac-dev/compare/rhtap-ui-v0.0.1...rhtap-ui-v0.1.0) (2023-10-25)


### Features

* add kind annotation to EC ITS ([214367f](https://github.com/openshift/hac-dev/commit/214367f90d3c04a502cbd06261e7982fd05242ec))
* **import-flow:** add visibility annotation on component creation ([a74094d](https://github.com/openshift/hac-dev/commit/a74094df90362a80e6a5749693f567cb45dec726))
* **integration test:** add edit param modals in details ([69515dc](https://github.com/openshift/hac-dev/commit/69515dcb87e8e734b636fb667b7b7caa78dc359c))
* **integrationtest:** integrationTest params support ([c28d391](https://github.com/openshift/hac-dev/commit/c28d39172a39c3a653e5f8979535ad8cd38cfd32))


### Bug Fixes

* **add-snpshot-link:** add snapshot link in pipelinerun details page ([5bf8597](https://github.com/openshift/hac-dev/commit/5bf85975006a85990bc1ce8e9d48d07cfdf296d7))
* consider all pipeline runs, by using paging ([d6afd90](https://github.com/openshift/hac-dev/commit/d6afd90514b69353ea6ca27edfd537bff1cbe9d5))
* **int-filter:** modify integration test search filter field ([78c7518](https://github.com/openshift/hac-dev/commit/78c7518b603f7dcb0a1901106a959c715b002d4b))
* modify the integration test path description ([91f1a47](https://github.com/openshift/hac-dev/commit/91f1a477f8955b454bf0839df5df86832936b25c))
* **overview graph:** navigate to components list on 'No builds yet' click ([26bb6ef](https://github.com/openshift/hac-dev/commit/26bb6ef82f9e91741a4ab6bc5dcb32d4dc88c860))
* **releases:** filtering & sorting for releases ([c8a6a1a](https://github.com/openshift/hac-dev/commit/c8a6a1a443abe3be57d4f53dc03462cfd71cfbf4))
* **secret-list:** fix secret list page error when secret is missing status field ([b02853c](https://github.com/openshift/hac-dev/commit/b02853c9a475fac85a812d72e73e0bcfc94a6667))
* **task logs:** show logs for skipped or idle tasks if they exist ([9470293](https://github.com/openshift/hac-dev/commit/9470293b09a1ecb9ef6948602978796389243866))
* **test:** remove check from e2e tests for latest commits on overview page ([175f28f](https://github.com/openshift/hac-dev/commit/175f28f1ffb2a747b86128e3f085389112202235))
* **test:** update pipeline labels ([9f81399](https://github.com/openshift/hac-dev/commit/9f81399d087a5db199aff7fa6889f094fd03a3f5))
* **test:** wait for new github repo availability ([ab3dbde](https://github.com/openshift/hac-dev/commit/ab3dbde58c6616be6b138f55b216a9ab346a9a89))

## [0.0.1](https://github.com/openshift/hac-dev/compare/rhtap-ui-v0.0.1...rhtap-ui-v0.0.2) (2023-09-29)

#### Notes - This is the first release so added features and bug fixes manually for past 1 month as part of release notes. This will get better for the next release when we start to follow conventional commit messages.

### Features

* Improve application overview screen
* Support creation of build and deployment secrets
* add list view for ReleaseStrategy
* add list view for ReleasePlanAdmission
* add Release plan list page
* Snapshot Pipeline Runs Tab
* Enable auth flow for private repo 
* Add Deployments tab to the Component Details page
* use RemoteSecret for partner task secrets 
* Add component details page
* Add snapshot details page
* Add secrets list page and delete action
* Upgrade to PF version 5
* show pac build errors

### Bug Fixes

* Update computation of deployed application status
* Fix integration name validation issue
* fix application name auto suggestion when git url has extra spaces
* Fix component details when no container image
* fix back and cancel action for git import form
* Fix for build node widths in application lifecycle graph
* Fix the broken style issue on local setup
* select first failed logs tab by default
* Fix for recent commits rows disappearing on scroll
* fix delete modal redirection issue
* Fix broken styles on overview page
* fix vulnerability column not loading issue
* fix cacheKey not updating issue
