export const hacAPIEndpoints = {
  applications: (applicationName: string) =>
    `/api/k8s/apis/appstudio.redhat.com/v1alpha1/namespaces/${Cypress.env(
      'HAC_NAMESPACE',
    )}/applications/${applicationName}`,

  environments: (envName: string) =>
    `/api/k8s/workspaces/${Cypress.env(
      'HAC_WORKSPACE',
    )}/apis/appstudio.redhat.com/v1alpha1/namespaces/${Cypress.env(
      'HAC_NAMESPACE',
    )}/environments/${envName}`,

  pipelinerunsFilter: (applicationName: string, label: string) =>
    `/api/k8s/workspaces/${Cypress.env(
      'HAC_WORKSPACE',
    )}/apis/tekton.dev/v1beta1/namespaces/${Cypress.env(
      'HAC_NAMESPACE',
    )}/pipelineruns?labelSelector=appstudio.openshift.io/application=${applicationName},${label}&limit=250`,

  secrets: (secretName: string) =>
    `/api/k8s/workspaces/${Cypress.env('HAC_WORKSPACE')}/api/v1/namespaces/${Cypress.env(
      'HAC_NAMESPACE',
    )}/secrets/${secretName}`,

  resources: (resourceType: string) =>
    `/api/k8s/apis/appstudio.redhat.com/v1beta1/namespaces/${Cypress.env(
      'HAC_NAMESPACE',
    )}/${resourceType}s`,
};

export const githubAPIEndpoints = {
  orgRepos: `https://api.github.com/orgs/redhat-hac-qe/repos`,
  qeRepos: (repoName: string) => `https://api.github.com/repos/redhat-hac-qe/${repoName}`,
  repoImport: (toRepoName: string) =>
    `https://api.github.com/repos/redhat-hac-qe/${toRepoName}/import`,
  merge: (owner: string, repoName: string, pullNumber: number) =>
    `https://api.github.com/repos/${owner}/${repoName}/pulls/${pullNumber}/merge`,
  contents: (owner: string, repoName: string, filePath: string) =>
    `https://api.github.com/repos/${owner}/${repoName}/contents/${filePath}`,
};
