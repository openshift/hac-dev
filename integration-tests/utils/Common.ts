import { NavItem } from '../support/constants/PageTitle';
import { consentButton, navigation, waits } from '../support/pageObjects/global-po';

export class Common {
  static openAppStudioBaseURL() {
    cy.visit(Cypress.env('HAC_BASE_URL'));
  }

  static navigateTo(link: NavItem) {
    cy.get(navigation.sideNavigation).within(() => {
      cy.get(waits.linkPlaceholder).should('not.exist');
      cy.get(`[data-ouia-component-id="${link}"]`).click();
    });
    Common.waitForLoad();
  }

  static openURL(URL: string) {
    cy.url().then(($url) => {
      if ($url !== URL) {
        cy.visit(URL);
      }
    });
  }

  static generateAppName(prefix = 'test-app') {
    const name = `${prefix}-${new Date().getTime()}`;
    return name.substring(0, name.length - 4);
  }

  static openApplicationURL(applicationName: string) {
    Common.openURL(
      `${Cypress.env('HAC_BASE_URL')}/applications/${applicationName.replace('.', '-')}`,
    );
    Common.verifyPageTitle(applicationName);
    Common.waitForLoad();
  }

  static waitForLoad(timeout = 120000) {
    for (const item of Object.values(waits)) {
      cy.get(item, { timeout }).should('not.exist');
    }
  }

  static verifyPageTitle(title: string) {
    cy.contains('h1', title, { timeout: 180000 }).should('be.visible');
  }

  static clickOnConsentButton() {
    cy.get('body')
      .find(consentButton)
      .its('length')
      .then((res) => {
        if (res > 0) {
          cy.get(consentButton).click();
        }
      });
  }

  static cleanNamespace() {
    if (Cypress.env('CLEAN_NAMESPACE') === 'true') {
      cy.exec('export KUBECONFIG=~/.kube/appstudio-config && ./delete-script.sh', {
        timeout: 600000,
      })
        .its('stdout')
        .should('contain', 'Done running the script');
    }
  }

  static getOrigin() {
    return new URL(Cypress.env('HAC_BASE_URL')).origin;
  }

  static checkRowValues(locator: string, valuesToAssert: string[]) {
    for (let value of valuesToAssert) {
      cy.contains(`[data-id="${locator}"]`, value, { timeout: 20000 }).should('exist');
    }
  }

  static checkResponseBodyAndStatusCode(url: string, responseBodyContent: string, waitInterval: number = 2000, retryNum: number = 0) {
    expect(retryNum).to.be.lessThan(10);

    cy
      .request({
        url: url,
        timeout: 30000,
        failOnStatusCode: false,
      })
      .then((resp) => {
        if (resp.status === 200 && resp.body.includes(responseBodyContent) === true) {
          cy.log(`The response body of URL: ${url}, now contains the content: ${responseBodyContent}`);
          return
        }
        else {
          cy.log('The response body of URL doesnt contain the expected content yet, retrying...')
          cy.wait(waitInterval)
          Common.checkResponseBodyAndStatusCode(url, responseBodyContent, waitInterval, retryNum + 1);
        }
      })
  }

  static createGitHubRepository(repoName: string) {
    cy.request({
      method: 'POST',
      url: 'https://api.github.com/orgs/redhat-hac-qe/repos',
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${Cypress.env('GH_TOKEN')}`,
        "X-GitHub-Api-Version": "2022-11-28"
      },
      body: {
        'name': repoName
      }
    });
  }

  static deleteGitHubRepository(owner: string, repoName: string) {
    cy.request({
      method: 'DELETE',
      url: `https://api.github.com/repos/redhat-hac-qe/${repoName}`,
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${Cypress.env('GH_TOKEN')}`,
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
  }

  static importCodeToGitHubRepository(fromRepoLink: string, toRepoName: string) {
    cy.request({
      method: 'PUT',
      url: `https://api.github.com/repos/redhat-hac-qe/${toRepoName}/import`,
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${Cypress.env('GH_TOKEN')}`,
        "X-GitHub-Api-Version": "2022-11-28"
      },
      body: {
        'vcs': 'git',
        'vcs_url': fromRepoLink
      }
    });
  }

  static getPRNumber(componentName: string, publicGitRepo: string) {
    const owner = publicGitRepo.split("/")[3];
    const repoName = publicGitRepo.split("/")[4];

    return cy.request({
      url: `https://api.github.com/search/issues?q=${componentName}+type:pr+repo:${owner}/${repoName}`,
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${Cypress.env('GH_TOKEN')}`,
        "X-GitHub-Api-Version": "2022-11-28"
      }
    }).then((searchIssueResponse) => {
      const pullNumber = searchIssueResponse.body.items[0]["number"];
      cy.log(pullNumber);

      cy.wrap(String(pullNumber)).as('pullNumber')
    });
  }

  static deleteFolder(publicGitRepo: string, folderToDelete: string) {
    const GITHUB_TOKEN: string = Cypress.env('GH_TOKEN');
    const REPOSITORY_OWNER = publicGitRepo.split("/")[3];
    const REPOSITORY_NAME = publicGitRepo.split("/")[4];
    const TYPE = { BLOB: 'blob', TREE: 'tree' };
    const BRANCH_NAME = "main";
    const COMMITS_URL = `https://api.github.com/repos/${REPOSITORY_OWNER}/${REPOSITORY_NAME}/git/commits`;
    const REPOSITORY_TREES_URL = `https://api.github.com/repos/${REPOSITORY_OWNER}/${REPOSITORY_NAME}/git/trees`;
    const REF_URL = `https://api.github.com/repos/${REPOSITORY_OWNER}/${REPOSITORY_NAME}/git/refs/heads/${BRANCH_NAME}`;
    const headers = {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    };

    // Get the sha of the last commit on BRANCH_NAME
    cy.request({
      url: REF_URL,
      headers: headers
    }).then((resp) => {
      const currentCommitSha = resp.body.object['sha'];

      // Get the sha of the root tree on the commit retrieved previously
      const COMMIT_URL = `${COMMITS_URL}/${currentCommitSha}`;

      cy.request({
        url: COMMIT_URL,
        headers: headers
      }).then((resp) => {
        const treeSha = resp.body.tree['sha'];

        // Get the tree corresponding to the folder that must be deleted.
        // Uses the recursive query parameter to retrieve all files whatever the depth.
        // The result might come back truncated if the number of hits is big.
        // This truncated output case is NOT handled.
        cy.request({
          url: `${REPOSITORY_TREES_URL}/${BRANCH_NAME}:${folderToDelete}`,
          headers: headers,
          body: {
            recursive: true
          }
        }).then((resp) => {
          const oldTree = resp.body.tree;

          // Create a tree to edit the content of the repository, basically select all files
          // in the previous tree and mark them with sha=null to delete them.
          // The folder only exists in git if it has a file in its offspring.
          const newTree = oldTree
            .filter(({ type }) => type === TYPE.BLOB)
            .map(({ path, mode, type }) => (
              { path: `${folderToDelete}/${path}`, sha: null, mode, type } // If sha is null => the file gets deleted
            ));

          // Create a new tree with the file offspring of the target folder removed
          cy.request({
            method: 'POST',
            url: REPOSITORY_TREES_URL,
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: `Bearer ${GITHUB_TOKEN}`,
              "X-GitHub-Api-Version": "2022-11-28",
            },
            body: {
              base_tree: treeSha,
              tree: newTree
            }
          }).then((resp) => {
            const newTreeSha = resp.body.sha;

            // Create a commit that uses the tree created above
            cy.request({
              url: COMMITS_URL,
              method: 'POST',
              headers: headers,
              body: {
                message: 'Committing with GitHub\'s API :fire:',
                tree: newTreeSha,
                parents: [currentCommitSha]
              }
            }).then((resp) => {
              const newCommitSha = resp.body.sha;

              // Make BRANCH_NAME point to the created commit
              cy.request({
                url: REF_URL,
                method: 'POST',
                headers: headers,
                body: {
                  sha: newCommitSha
                }
              });
            });
          });
        });
      });
    });
  }
}
