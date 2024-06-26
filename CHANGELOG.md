# Changelog

## [0.5.1](https://github.com/openshift/hac-dev/compare/rhtap-ui-v0.5.0...rhtap-ui-v0.5.1) (2024-06-24)


### Bug Fixes

* **BuildPipeline:** filter pipeine run based on sender annotation ([ee781ec](https://github.com/openshift/hac-dev/commit/ee781ec71502dcab8032136bbb123317f0d5b60a))
* **e2e:** fix basic happy path ([9820229](https://github.com/openshift/hac-dev/commit/98202297f868c9351763264b6306774df9bc953e))
* **e2e:** move GH_TOKEN verification ([89b89f7](https://github.com/openshift/hac-dev/commit/89b89f731ac1c2d3e1cf2ef45ac454b68bd8ddd6))
* **git-utils:** add unit test for parsing git urls ([397620e](https://github.com/openshift/hac-dev/commit/397620e78fe3ae310afdd7272fde917e276872bd))
* **GitRepoLink:** add support for gitlab.cee.redhat.com urls ([3c4b791](https://github.com/openshift/hac-dev/commit/3c4b791c030114228416537f8e06bb33619f7ea8))
* **ImageRepository:** add iimage controller annontation while create IR cr ([731eb36](https://github.com/openshift/hac-dev/commit/731eb3671c8a3e8face5810c6ff3e913f47e3d41))
* **import:** do not send generate annotation in component ([80837b7](https://github.com/openshift/hac-dev/commit/80837b760827a5f3a338e570c313c0a138835da7))
* **ImportFlow:** add input field for docker file path ([e1546f7](https://github.com/openshift/hac-dev/commit/e1546f7df5df126800bec50a76b85f53a1d6c15e))
* **OverviewPage:** remomve NamepspacedPage wrapper from Overview page ([eee873d](https://github.com/openshift/hac-dev/commit/eee873db78dbd10f4c8c719c2beef01ecd4ef46b))
* **release:** remove releaseplan strategy ([cb49ba5](https://github.com/openshift/hac-dev/commit/cb49ba519d1964d42809f23aa809947c1c66118a))
* **release:** remove strategy component ([b9d6f85](https://github.com/openshift/hac-dev/commit/b9d6f85bed46d505d662e37b0aa4fb2a917cef7e))
* **secret:** link serviceaccount ([#950](https://github.com/openshift/hac-dev/issues/950)) ([f898233](https://github.com/openshift/hac-dev/commit/f89823352dcba7c0f8ece6bd8f177e21b021b025))
* **SecretListPage:** add workspace breadcrumbs on secrets list page ([71724ec](https://github.com/openshift/hac-dev/commit/71724ec0dd0576fd533ea37d2d8e39fb80b3bd0a))
* show data for build image and commit author ([714ce4b](https://github.com/openshift/hac-dev/commit/714ce4be3c3539d7098eb2d76eb8e6947dead366))
* **test:** don't remove repo if test failed to easy failure debugging ([bab0439](https://github.com/openshift/hac-dev/commit/bab04390464c6a49e5f6debbcf84b3064d66d14a))
* **test:** dont verify certificate, added due to test deployments in infra-deployments PR check jobs ([149de17](https://github.com/openshift/hac-dev/commit/149de173982ecae4071ed69d1bb357fcacf2617f))
* **test:** fix advanced happy path ([1c19720](https://github.com/openshift/hac-dev/commit/1c19720b51c221f994791fb99cfedbb08048b4b9))
* **WorkspacedPage:** add unit tests for Workspaced component ([08ec922](https://github.com/openshift/hac-dev/commit/08ec922d119f6a6d4e1c061fa107b1b0e524fc23))

## [0.5.0](https://github.com/openshift/hac-dev/compare/rhtap-ui-v0.4.0...rhtap-ui-v0.5.0) (2024-06-03)


### Features

* **Component-relationship:** add modal to define component relationship ([#898](https://github.com/openshift/hac-dev/issues/898)) ([4726d85](https://github.com/openshift/hac-dev/commit/4726d856a519c467f424808826aea1612447ec65))
* **docs:** update learn more links to use Konflux docs ([d71880f](https://github.com/openshift/hac-dev/commit/d71880ff8d2fd36fdc3bf9ec93f93729c1af9e93))
* **ImportForm:** add base form including the source and component section ([7165f52](https://github.com/openshift/hac-dev/commit/7165f5248b8755c987dea77c0b857a0590d88457))
* **plr:** add test suites ([1934ae5](https://github.com/openshift/hac-dev/commit/1934ae539cd6f9ff21625a73678672a12de6d9d3))
* **plr:** add to hook ([fbaf249](https://github.com/openshift/hac-dev/commit/fbaf2490a09ebe74990634f2cb68b3523406aa38))
* **plr:** fix test ([6173a44](https://github.com/openshift/hac-dev/commit/6173a44dd1a1fe5041e9ced4281b209099bd1265))
* **releases:** add release plan form ([7974d6c](https://github.com/openshift/hac-dev/commit/7974d6c9fdd83caa5d2c29508af76d07d3c5ef9e))
* **release:** trigger release form ([#911](https://github.com/openshift/hac-dev/issues/911)) ([cc55262](https://github.com/openshift/hac-dev/commit/cc552625a615cedf0579c1aef93ac53d3ad8a171))
* **secret:** add css to make field widths consistent ([4af54fd](https://github.com/openshift/hac-dev/commit/4af54fdedaea15b8f7ebe04f9f060be3ea1d89d3))
* **secret:** add linking secret to service account ([c14ebb6](https://github.com/openshift/hac-dev/commit/c14ebb6323fb1ca135ef8f5716d40baf7f9a9110))
* **secrets:** add k8sSecrets instead of remote secrets ([aecb9e8](https://github.com/openshift/hac-dev/commit/aecb9e86e0f2772f1d75294c1f90967561c1677c))
* **secrets:** add scm host metadata ([f8e18dd](https://github.com/openshift/hac-dev/commit/f8e18dd89d7706d451b108770768a8b210423f23))
* **secrets:** fix review comments ([ae961df](https://github.com/openshift/hac-dev/commit/ae961dfbfb34a564c03d734f07d3e34e931380bf))
* **secrets:** remove deployments from add secrets form ([9d775a5](https://github.com/openshift/hac-dev/commit/9d775a5fcd3b14b1bcc93b4f34f8ddb61388a6c8))
* **STONEINTG-837:** update url of redhat-appstudio/integration-examples ([#924](https://github.com/openshift/hac-dev/issues/924)) ([dac1cfd](https://github.com/openshift/hac-dev/commit/dac1cfda4f7a1c77acd8b3ffd3b99b16dfc42994))
* **STONEINTG-877:** add Fixable to vulnerabilities titles ([251ed64](https://github.com/openshift/hac-dev/commit/251ed64e98565d275b0c417bcfdcadbd719e9bbb))
* **taskRun:** failed taskRun should show log page initially ([9efb95f](https://github.com/openshift/hac-dev/commit/9efb95f262a0ca89c58c215e69a1f07250d3972c))
* **theme:** retheme UI for Konflux ([993415d](https://github.com/openshift/hac-dev/commit/993415d5dd70d23dd83b6e0cb2bfc7b3f2f701d8))


### Bug Fixes

* **Application:** add application thumbnail check on resource metadata ([b04793b](https://github.com/openshift/hac-dev/commit/b04793bc8d2b79470b460c86bb83a536af2d1674))
* **app:** update text content through out app ([e9f7261](https://github.com/openshift/hac-dev/commit/e9f7261198e7faee89a8c154dfeea0b49728e803))
* **ComponentRelation:** fix visualization on details page ([dd171f7](https://github.com/openshift/hac-dev/commit/dd171f7cf1bb3fe66e3ea2d4fe91ea4dced8a36b))
* **ComponentRelation:** use component from all applications ([7c69142](https://github.com/openshift/hac-dev/commit/7c69142dab63a88150a0a20de5e1d57232f12284))
* **Component:** remove sha hash from container image url ([574814f](https://github.com/openshift/hac-dev/commit/574814fc9817aa8a828c10300ed5659cb793e24a))
* **components:** add unit test for useAllComponents ([a58d847](https://github.com/openshift/hac-dev/commit/a58d847b4e063230f916aaa1fad359ccfc9cc32a))
* **content:** update overview page content based on Konflux website ([7a3090e](https://github.com/openshift/hac-dev/commit/7a3090e76cc61f6e1d4c5fac4c4b79766166ced2))
* **docker:** update .dockerignore ([10244c7](https://github.com/openshift/hac-dev/commit/10244c786fd8156d62b39b770816b35971bfc809))
* **e2e:** avoid getting stuck waiting for spinner ([bbd6652](https://github.com/openshift/hac-dev/commit/bbd66525bdbf92339e6f7f2177832b124f2ba6df))
* **e2e:** force render the table on new data changes ([9605e76](https://github.com/openshift/hac-dev/commit/9605e76bfd7999514b8cbfc17e5f54bc5b449c58))
* **e2e:** remove check of target in secrets tab ([e260d71](https://github.com/openshift/hac-dev/commit/e260d713d84f12f35c6a0fe1bc540babdee5048c))
* **e2e:** replace github import API with template generation ([630d545](https://github.com/openshift/hac-dev/commit/630d54524f3dda995e0475b9787ac6e707617cdb))
* **e2eTests:** fix advance happy path and environment page tests ([de5be43](https://github.com/openshift/hac-dev/commit/de5be43e1e9b9b34c33a788d6c91d421f2766fc7))
* **e2eTests:** fix e2e tests to work without deployments and environments ([72058f9](https://github.com/openshift/hac-dev/commit/72058f97609a93d3928c577e743bcfc28c1d5a08))
* **EnterpriseContract:** show ec results under security tab from tkn ([115ac10](https://github.com/openshift/hac-dev/commit/115ac106722fa9888e6df1d7e85e4e43e11a93c7))
* **Environment/Deployments:** remove deprecated code for environments and deployments ([88647a6](https://github.com/openshift/hac-dev/commit/88647a60c6a4e6cd405539e83c7cc38a5304b50a))
* **Environment/Deployments:** remove environments and deployments refrences from UI ([88fc539](https://github.com/openshift/hac-dev/commit/88fc5393d03054d53c4cbd1c1af8b1f69cc29c27))
* **environments:** fix unit tests and remove mention of deployments ([f2569a9](https://github.com/openshift/hac-dev/commit/f2569a9f231e6fb793e5734256a8465d28d0aa46))
* **github-app:** change github app url and name ([ed46215](https://github.com/openshift/hac-dev/commit/ed46215fe88ba9cf9e9d64f7bd8a7685ed5a97a1))
* **GithubApp:** fix github app urls for internal instance ([095a8e6](https://github.com/openshift/hac-dev/commit/095a8e609e413cb71296365145e7893abc35aa16))
* **GithubRedirect:** add redirects for url from github checks ([add8fa1](https://github.com/openshift/hac-dev/commit/add8fa104c463decf02e3003629a125dd7c5952a))
* **GithubRedirect:** use task name instead of task run ([32a46ad](https://github.com/openshift/hac-dev/commit/32a46adc7f4aeed180cc9237f41a18be42116e1f))
* **ImageRepository:** use ImageRespository cr instead of component annotation ([158e171](https://github.com/openshift/hac-dev/commit/158e171eddff5a8cfc55cc8bf55df576e61ca9d6))
* **ImportForm:** add build secret section ([2be13bd](https://github.com/openshift/hac-dev/commit/2be13bdf6f4d94d60834a46fddc6854507ec436e))
* **ImportForm:** add ImageRepository support ([5de16c2](https://github.com/openshift/hac-dev/commit/5de16c2401600e775723c0a0b0a87c2671c6c6ad))
* **ImportForm:** add pipeline section and fetch pipeline template from config map ([402e2ac](https://github.com/openshift/hac-dev/commit/402e2acd6854a6b9d20f1d53822adf4c2efe0e48))
* **ImportForm:** add submit-utils to create application and components ([7b466b5](https://github.com/openshift/hac-dev/commit/7b466b534555f8849f35df790e878d55661632a6))
* **ImportForm:** add unit tests and cleanup redundant code ([c6a2019](https://github.com/openshift/hac-dev/commit/c6a2019b5659f76ed396ef4dc0bff3b1c345c808))
* **logs:** update fetch method for tekton-results pipelinerun logs ([537cd9d](https://github.com/openshift/hac-dev/commit/537cd9d3afad6cc65a7cab7134e07b7ba1b5b7d0))
* **overview:** change slack channel name and typo fix ([c79053c](https://github.com/openshift/hac-dev/commit/c79053ce1031ad1370bf638a01fa8cacfb812154))
* **pipeline-modal:** fix table row width for pipeline modal ([493edf0](https://github.com/openshift/hac-dev/commit/493edf0e0b9cce055cf72edda1df54128511abff))
* **pipeline:** fix pipeline rerun actions to run pac build ([7415588](https://github.com/openshift/hac-dev/commit/7415588a80d27a79d27ac88c16f82b23fe22cb9f))
* **PipelineSection:** select default pipeline and remove community pipeline ([6e6cd66](https://github.com/openshift/hac-dev/commit/6e6cd661aa58c543b1982a8e24950a8ef42f0507))
* **plr:** remove hidden property from rerun action ([746eace](https://github.com/openshift/hac-dev/commit/746eace16e37f8c5ae47b22a751260351ec33678))
* **PrivateAuth:** remove feature flag from auth flow ([5b13d3b](https://github.com/openshift/hac-dev/commit/5b13d3b96fb8523a97dabf2b69caf1aab7d06203))
* **release-plan:** update release plan form, add status and release plan addmision column ([2062fa6](https://github.com/openshift/hac-dev/commit/2062fa69dcdc165a17aa9a7173ceb5e200cf52b3))
* **release:** remove name check ([a45d06b](https://github.com/openshift/hac-dev/commit/a45d06b7d6e6ff3c166ee0aa66177063f2decfbd))
* **releases:** add links for snapshot in release details and list view ([542c47b](https://github.com/openshift/hac-dev/commit/542c47b50542ef80d2da6e86a227d1237519d84f))
* **release:** trigger release preselection ([e9e55b3](https://github.com/openshift/hac-dev/commit/e9e55b3cbe37c505c56bc89543ca27a4c2919539))
* **release:** update release links ([c75594f](https://github.com/openshift/hac-dev/commit/c75594f3d2777e059b6268dc463a2e0d045294a6))
* **results-api:** avoid refetching of API in case of errors and add error states ([98a2623](https://github.com/openshift/hac-dev/commit/98a2623e33f6ab077bd53e7c9d1c77d293e62c81))
* **results-api:** enable caching in the tekton results vulnerabilities API call ([0b28aeb](https://github.com/openshift/hac-dev/commit/0b28aeb550465b2daf9c142ea9ce609e9ed47c9c))
* **Secret:** add namespace as target to Remote secret creation ([e330c27](https://github.com/openshift/hac-dev/commit/e330c2777c0bf702f9af7858adf36d09a5976328))
* **secrets:** address review comments ([94eb084](https://github.com/openshift/hac-dev/commit/94eb08443616ff0d3ea68483733efedf3156a3c8))
* **testpipeline:** remove commits from filter ([f3569f5](https://github.com/openshift/hac-dev/commit/f3569f5b6d7831899f193f81eadfe41f18658f0a))
* **test:** remove menu item Learning resources ([283d2f7](https://github.com/openshift/hac-dev/commit/283d2f700beab21cd4395cca565e078ee14ffac8))
* **test:** stabilise vulnerabilities by refreshing the page during advanced happy path ([a14b600](https://github.com/openshift/hac-dev/commit/a14b600202185cdd6c73ad2a8dda26d142aba5d6))
* **UserAccess:** change minimum character limit for username ([e82a41c](https://github.com/openshift/hac-dev/commit/e82a41c58e0052fb71b9a158d039fcbad92410fe))

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
