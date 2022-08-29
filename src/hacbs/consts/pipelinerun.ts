export enum PipelineRunLabel {
  APPLICATION = 'appstudio.openshift.io/application',
  COMPONENT = 'appstudio.openshift.io/component',
  PIPELINE_TYPE = 'pipelines.appstudio.openshift.io/type',
  COMMIT_LABEL = 'pipelinesascode.tekton.dev/sha',
  COMMIT_URL_ANNOTATION = 'pipelinesascode.tekton.dev/sha-url',
  COMMIT_BRANCH_ANNOTATION = 'pipelinesascode.tekton.dev/on-target-branch',
  COMMIT_COMPONENT_LABEL = 'appstudio.openshift.io/component',
  COMMIT_USER_LABEL = 'pipelinesascode.tekton.dev/sender',
  COMMIT_REPO_ORG_LABEL = 'pipelinesascode.tekton.dev/url-org',
  COMMIT_REPO_URL_LABEL = 'pipelinesascode.tekton.dev/url-repository',
  COMMIT_PROVIDER_LABEL = 'pipelinesascode.tekton.dev/git-provider',
}

export enum PipelineRunType {
  BUILD = 'build',
  RELEASE = 'release',
  TEST = 'test',
}
