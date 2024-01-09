# Changelog

## [0.4.0](https://github.com/openshift/hac-dev/compare/rhtap-ui-v0.3.1...rhtap-ui-v0.4.0) (2024-01-09)


### Features

* **cmp:** add codecov tests ([9fe441d](https://github.com/openshift/hac-dev/commit/9fe441d726603997d7d7330a6da1d8cff2582ae9))
* **cmp:** address review comments ([f3c8440](https://github.com/openshift/hac-dev/commit/f3c84403e122fbf7fe5a3524e8b35febf9401e1b))


### Bug Fixes

* **commit:** use black color for GH commit logo ([7038569](https://github.com/openshift/hac-dev/commit/7038569c9fac77e8e2e7b5b0f582f736967ce86a))
* **import-flow:** optmize import flow api requests ([db4f4c2](https://github.com/openshift/hac-dev/commit/db4f4c27891d4e507bd455015a6550d4daf7ce52))
* **import:** avoid resetting name field if changed ([e676903](https://github.com/openshift/hac-dev/commit/e676903782076a9bc6a11a11b9e98ae5b548713a))
* **integration:** handle missing rev in git params ([d27dd67](https://github.com/openshift/hac-dev/commit/d27dd676a6d66922387a06fe46e5dabe7456874a))
* **release-plan:** add undefined check on labels ([c2f7b26](https://github.com/openshift/hac-dev/commit/c2f7b26228eacb0f3257112a6489f1d147ce21a1))
* **slack:** update slack links ([b5a7946](https://github.com/openshift/hac-dev/commit/b5a79462481a78ef67df4dfeb93a4b8f53d5112c))

## [0.3.1](https://github.com/openshift/hac-dev/compare/rhtap-ui-v0.3.0...rhtap-ui-v0.3.1) (2023-12-12)


### Bug Fixes

* **import:** add access check to add secret button ([3f86e93](https://github.com/openshift/hac-dev/commit/3f86e93a2272bab9c613cb1e6428a8391c3142ad))
* **import:** avoid stopping if cdq deletion fails ([412de8c](https://github.com/openshift/hac-dev/commit/412de8c515ed848f6cf22bff3ccafc77ddd82eb0))

## [0.3.0](https://github.com/openshift/hac-dev/compare/rhtap-ui-v0.2.0...rhtap-ui-v0.3.0) (2023-12-01)


### Features

* **dependencies:** update package dependencies and related fixes ([18b77b1](https://github.com/openshift/hac-dev/commit/18b77b1cab1c0841f3103350f8ad3fc8b055a5cf))
* **private-auth:** add a form to initiate private auth flow ([5ccfa07](https://github.com/openshift/hac-dev/commit/5ccfa07f7934358d4909fe47aa44eace166f8aab))


### Bug Fixes

* **access:** fix username validation regex ([2c31890](https://github.com/openshift/hac-dev/commit/2c31890c7abb602173f26b8371aa4d62d02c9cbb))
* **applications:** use SEB for app deploy date ([a23368d](https://github.com/openshift/hac-dev/commit/a23368d108c40b6881a26d23451406421d531ec4))
* **commit:** avoid using test pipeline for commit ([4ea8d22](https://github.com/openshift/hac-dev/commit/4ea8d22914471d6b2f2c51e9cca8cb5721d58d49))
* **components:** show url for image components ([dd2eac5](https://github.com/openshift/hac-dev/commit/dd2eac54914fee3220ce8b15de7fc8380d728007))
* **deps:** replace npm with yarn package manager ([6a37e4f](https://github.com/openshift/hac-dev/commit/6a37e4f4221cc9862c6c54ae62d35d6e582fa96b))
* **e2e:** delete component after it refreshes ([ead67e9](https://github.com/openshift/hac-dev/commit/ead67e9a415c5ac7e75c53a1ccbd90e309577e98))
* **e2e:** remove inspect-image from task list ([369451a](https://github.com/openshift/hac-dev/commit/369451a05cac234903d2ae2e2fa46fa6fc54aa0d))
* **snapshot:** add test pipelinerun list and capitalize breadcrumbs ([#847](https://github.com/openshift/hac-dev/issues/847)) ([b7359d4](https://github.com/openshift/hac-dev/commit/b7359d4aa2074d45563c883455119814ef718719))
* **tests:** fix unit tests after react 18 upgrade ([bbf16c3](https://github.com/openshift/hac-dev/commit/bbf16c3000a8192ee4dcda006ba35f4a63a7cb7b))
* **type:** fix children type for react 18 and linting issues ([d4b5a4f](https://github.com/openshift/hac-dev/commit/d4b5a4f2292bfa35e139ab687cada1230131d262))

## [0.2.0](https://github.com/openshift/hac-dev/compare/rhtap-ui-v0.1.0...rhtap-ui-v0.2.0) (2023-11-09)


### Features

* **components:** update components list view ([a045f0a](https://github.com/openshift/hac-dev/commit/a045f0a7fe65fba80b12d62d332e296192463e4b))
* **snapshots:** add environmentprovision error to details ([a5bab52](https://github.com/openshift/hac-dev/commit/a5bab523127d02143c3b6c67bfdfccd57a2f6215))
* **snapshots:** add unit tests and update as per UX ([7c8451e](https://github.com/openshift/hac-dev/commit/7c8451eeb59a075e407e2abf50295eb5f0500637))


### Bug Fixes

* **access:** use ws lister api to fetch access ([be9563d](https://github.com/openshift/hac-dev/commit/be9563de1a48566028d143f282ea5d787b184516))
* **component-activity-tab:** fix commit activity tab in components details page ([f9ee28e](https://github.com/openshift/hac-dev/commit/f9ee28e26017554198b034ee14519be6a13342a2))
* **e2e:** obscure secrets in video recordings ([1e2426d](https://github.com/openshift/hac-dev/commit/1e2426d15138676d143d4ec096551d917524840d))
* **e2e:** select the correct itest pipeline ([b03c974](https://github.com/openshift/hac-dev/commit/b03c97490970ecacecdff4acaa231deae0ea1ec9))
* **snapshot:** add commit label to triggered by ([2d1d691](https://github.com/openshift/hac-dev/commit/2d1d6913c6d96fafaac3f81bf2f0396965386376))
* update message for no access page ([1d2e5c6](https://github.com/openshift/hac-dev/commit/1d2e5c6069e5cbb0f02f9c7d4b620acacb778816))
* update text for import page ([bafefbf](https://github.com/openshift/hac-dev/commit/bafefbf3bd4a04febf8054552e564d029d1c0f9a))

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
