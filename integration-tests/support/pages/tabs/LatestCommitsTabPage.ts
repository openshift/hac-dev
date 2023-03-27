import { Common } from "../../../utils/Common";

// Latest Commits List view page
export class LatestCommitsTabPage {
  //NOTE : This is currently not being used. keeping it for incase future for use case.
  fetchCommitSHAOnPR(componentName: string, publicGitRepo: string, pullNumber: number) {
    const owner = publicGitRepo.split('/')[3];
    const repoName = publicGitRepo.split('/')[4];
    Common.githubRequest('GET', `https://api.github.com/repos/${owner}/${repoName}/pulls/${pullNumber}/commits`)
  }

  mergePR(owner: string, repoName: string, pullNumber: number, commitTitle: string, commitMessage: string) {
    const body = { commit_title: `${commitTitle}`, commit_message: `${commitMessage}` }
    Common.githubRequest('PUT', `https://api.github.com/repos/${owner}/${repoName}/pulls/${pullNumber}/merge`, body).then((result) => {
      cy.wrap(JSON.stringify(result.body)).as(commitTitle)
    });
  }

  editFile(gitRepo: string, filePath: string, commitMessage: string, updatedFileContentInBase64: string, fileSHA: string,) {
    const owner = gitRepo.split('/')[3];
    const repoName = gitRepo.split('/')[4];
    const body = { message: `${commitMessage}`, content: `${updatedFileContentInBase64}`, sha: `${fileSHA}` }
    Common.githubRequest('PUT', `https://api.github.com/repos/${owner}/${repoName}/contents/${filePath}`, body)
  }
}
