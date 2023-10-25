# Contributing Guide

Welcome! We love receiving contributions from our community, so thanks for stopping by! There are many ways to contribute, including submitting bug reports, improving documentation, submitting feature requests, reviewing new submissions, or contributing code that can be incorporated into the project.

This document describes our development process. Following these guidelines shows that you respect the time and effort of the developers managing this project. In return, you will be shown respect in addressing your issue, reviewing your changes, and incorporating your contributions.

If you're not looking for some kinds of contributions, note that up front:

> Please, don't use the issue tracker for support questions. Instead use: #forum-hac-dev in CoreOS Slack.

**Table of Contents:**

- [Contributing Guide](#contributing-guide)
  - [Code of Conduct](#code-of-conduct)
  - [Important Resources](#important-resources)
  - [Feature Requests](#feature-requests)
  - [Reporting Bugs](#reporting-bugs)
  - [Contributing Code](#contributing-code)
    - [Getting Started](#getting-started)
    - [Finding an Issue](#finding-an-issue)
    - [Contribution Flow](#contribution-flow)
    - [Building the Project](#building-the-project)
    - [Testing](#testing)
    - [Style Guidelines](#style-guidelines)
    - [Code Formatting](#code-formatting)
    - [Whitespace Cleanup](#whitespace-cleanup)
    - [Git Commit Guidelines](#git-commit-guidelines)
  - [Pull Request Process](#pull-request-process)
    - [Review Process](#review-process)
    - [Addressing Feedback](#addressing-feedback)


## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). We expect all contributors to follow the [Code of Conduct](CODE_OF_CONDUCT.md) and to treat fellow humans with respect.


## Important Resources

* docs: TBD
* bugs: [Github Issues](https://github.com/openshift/hac-dev/issues)
* comms: [#forum-hac-dev](https://app.slack.com/client/T027F3GAJ/C02GG6FUXCH) in CoreOS Slack.
* wiki: TBD


## Feature Requests

Please create a new GitHub issue for any major changes and enhancements that you wish to make. Please provide the feature you would like to see, why you need it, and how it will work. Discuss your ideas transparently and get community feedback before proceeding.

Major Changes that you wish to contribute to the project should be discussed first in an GitHub issue that clearly outlines the changes and benefits of the feature.

Small Changes can directly be crafted and submitted to the GitHub Repository as a Pull Request. See the section about Pull Request Submission Guidelines, and for detailed information the core development documentation.

## Reporting Bugs

**If you find a security vulnerability, do NOT open an issue. Email hack-eng@redhat.com instead.**

Before you submit your issue, please [search the issue archive](https://github.com/openshift/hac-dev/issues) - maybe your question or issue has already been identified or addressed.

If you find a bug in the source code, you can help us by [submitting an issue to our GitHub issue tracker](https://github.com/openshift/hac-dev/issues)]. Even better, you can submit a Pull Request with a fix.


## Contributing Code

### Getting Started

You will need to fork the main repository to work on your changes. Simply navigate to our GitHub page and click the "Fork" button at the top. Once you've forked the repository, you can clone your new repository and start making edits.

In git it is best to isolate each topic or feature into a “topic branch”. While individual commits allow you control over how small individual changes are made to the code, branches are a great way to group a set of commits all related to one feature together, or to isolate different efforts when you might be working on multiple topics at the same time.

While it takes some experience to get the right feel about how to break up commits, a topic branch should be limited in scope to a single issue

```
# Checkout the master branch - you want your new branch to come from master
git checkout master

# Create a new branch named newfeature (give your branch its own simple informative name)
git branch newfeature

# Switch to your new branch
git checkout newfeature
```


### Finding an Issue

The list of outstanding feature requests and bugs can be found on our on our [GitHub issue tracker](https://github.com/openshift/hac-dev/issues). Pick an unassigned issue that you think you can accomplish and add a comment that you are attempting to do it.


- `starter` labeled issues are deemed to be good low-hanging fruit for newcomers to the project
- `help-wanted` labeled issues may be more difficult than `starter` and may include new feature development
- `doc` labeled issues must only touch content in the `docs` folder.


### Contribution Flow

This is a rough outline of what a contributor's workflow looks like:

- Create a topic branch from where you want to base your work (usually master).
- Make commits of logical units.
- Make sure your commit messages are in the proper format (see below).
- Push your changes to a topic branch in your fork of the repository.
- Make sure the tests pass, and add any new tests as appropriate.
- Submit a pull request to the original repository.


### Building the Project

1. ```yarn install```

2. ```yarn start:prod:beta```

3. Open the URL listed in the terminal output.


### Testing

If you add code you need to add tests! We’ve learned the hard way that code without tests is undependable. If your pull request reduces our test coverage because it lacks tests then it will be rejected.


`yarn verify` will run `yarn lint` (eslint) and `npm test` (Jest)

### Style Guidelines

Read the [STYLEGUIDE](STYLEGUIDE.md) for code conventions.

### Code Formatting

We use Prettier with ESLint to format our files.


### Whitespace Cleanup

Don’t mix code changes with whitespace cleanup! If you are fixing whitespace, include those changes separately from your code changes. If your request is unreadable due to whitespace changes, it will be rejected.

> Please submit whitespace cleanups in a separate pull request.

### Git Commit Guidelines

We follow a rough convention for commit messages that is designed to answer two
questions: what changed and why. The subject line should feature the what and
the body of the commit should describe the why.

```
Add the test-cluster command

This uses tmux to setup a test cluster that you can easily kill and
start for debugging.
```

Commits that fix a Bugzilla bug should add the bug number like `Bug 12345: ` to
the first line of the commit and to the pull request title. To help others
quickly go to the bug, also add a link to the bug in the body of the commit
message. This allows automated tooling to generate links to bugs in release
notes and will eventually allow us to automatically transition bugs to `ON_QA`
when the fix is available in a nightly build. Here's an example commit message
for a change that fixes a Bugzilla bug:

```
Bug 1679272: Validate console can talk to OAuth token URL

Make sure we can successfully talk to the OAuth token URL after
discovering metadata before marking the console pod as ready.

Fixes https://bugzilla.redhat.com/show_bug.cgi?id=1679272
```

Pull requests that close GitHub issues should add text to the pull request
description in the format `Closes #123`. GitHub will automatically link each
issue to its pull request and close the issue when the pull request merges.

While we don't have automated tooling for JIRA issues, you should still include
a link to the issue in the commit description to make it easy to get to the issue.

## Pull Request Process

When you are ready to generate a pull request, either for preliminary review, or for consideration of merging into the project you must first push your local topic branch back up to GitHub:

```
git push origin newfeature
```

Once you've committed and pushed all of your changes to GitHub, go to the page for your fork on GitHub, select your development branch, and click the pull request button. If you need to make any adjustments to your pull request, just push the updates to your branch. Your pull request will automatically track the changes on your development branch and update.


### Review Process

We have `openshift-ci` setup for the project which automatically assigns reviewers for the Pull Request based on OWNERS file.

A Pull Request needs to have following labels to get merged -
- `lgtm` label from a reviewer.
- `approve` label from an approver.

Pull Requests will be automatically merged by `openshift-ci` once it has necessary labels and approvals.

### Addressing Feedback

Once a PR has been submitted, your changes will be reviewed and constructive feedback may be provided. Feedback isn't meant as an attack, but to help make sure the highest-quality code makes it into our project. Changes will be approved once required feedback has been addressed.

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your fork so it's easier to merge.

To update your forked repository, follow these steps:

```
# Fetch upstream master and merge with your repo's master branch
git fetch upstream
git checkout master
git merge upstream/master

# If there were any new commits, rebase your development branch
git checkout newfeature
git rebase master
```

If too much code has changed for git to automatically apply your branches changes to the new master, you will need to manually resolve the merge conflicts yourself.

Once your new branch has no conflicts and works correctly, you can override your old branch using this command:

```
git push -f
```

Note that this will overwrite the old branch on the server, so make sure you are happy with your changes first!


