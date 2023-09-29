# Changelog

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
