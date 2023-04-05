import { Common } from '../../../utils/Common';
import { UIhelper } from '../../../utils/UIhelper';

// Latest Commits List view page
export class LatestCommitsTabPage {
  //NOTE : This is currently not being used. keeping it for incase future for use case.
  fetchCommitSHAOnPR(componentName: string, publicGitRepo: string, pullNumber: number) {
    const owner = publicGitRepo.split('/')[3];
    const repoName = publicGitRepo.split('/')[4];
    Common.githubRequest(
      'GET',
      `https://api.github.com/repos/${owner}/${repoName}/pulls/${pullNumber}/commits`,
    );
  }

  mergePR(
    owner: string,
    repoName: string,
    pullNumber: number,
    commitTitle: string,
    commitMessage: string,
  ) {
    const body = { commit_title: `${commitTitle}`, commit_message: `${commitMessage}` };
    Common.githubRequest(
      'PUT',
      `https://api.github.com/repos/${owner}/${repoName}/pulls/${pullNumber}/merge`,
      body,
    ).then((result) => {
      expect(result.body.merged).to.be.true;
    });
  }

  editFile(
    gitRepo: string,
    filePath: string,
    commitMessage: string,
    updatedFileContentInBase64: string,
    fileSHA: string,
  ) {
    const owner = gitRepo.split('/')[3];
    const repoName = gitRepo.split('/')[4];
    const body = {
      message: `${commitMessage}`,
      content: `${updatedFileContentInBase64}`,
      sha: `${fileSHA}`,
    };
    Common.githubRequest(
      'PUT',
      `https://api.github.com/repos/${owner}/${repoName}/contents/${filePath}`,
      body,
    ).then((result) => {
      cy.log(`${commitMessage}_SHA : ${result.body.commit.sha}`);
      Cypress.env(`${commitMessage}_SHA`, result.body.commit.sha);
    });
  }

  clickOnCommit(commit: string) {
    UIhelper.clickRowCellInTable('Commit List', commit, commit);
  }

  verifyCommitsPageTitleAndStatus(commitTitle: string) {
    cy.contains('h2', commitTitle).contains('Succeeded');
  }

  verifyCommitID(sha: string, repoLink: string) {
    cy.contains('p', 'Commit:')
      .contains('a', sha.slice(0, 6))
      .should('be.visible')
      .should('have.attr', 'href', `${repoLink}/commit/${sha}`);
  }

  verifyBranch(branchName: string, repoLink: string) {
    cy.contains('p', 'Branch:')
      .contains('a', branchName)
      .should('be.visible')
      .should('have.attr', 'href', `${repoLink}/tree/main`);
  }

  verifyNodesOnCommitOverview(nodes: string[]) {
    nodes.forEach((nodetext) => {
      UIhelper.verifyGraphNodes(nodetext);
    });
  }
}
