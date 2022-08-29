export enum PipelineRunLabel {
  APPLICATION = 'appstudio.openshift.io/application',
  COMPONENT = 'appstudio.openshift.io/component',
  PIPELINE_USED_BY = 'pipelines.openshift.io/used-by',
  PIPELINE_TYPE = 'pipelines.appstudio.openshift.io/type',
  PIPELINE_NAME = 'tekton.dev/pipeline',
  COMMIT_LABEL = 'pipelinesascode.tekton.dev/sha',
  COMMIT_URL_ANNOTATION = 'pipelinesascode.tekton.dev/sha-url',
  COMMIT_BRANCH_ANNOTATION = 'build.appstudio.redhat.com/target_branch',
  COMMIT_COMPONENT_LABEL = 'appstudio.openshift.io/component',
  COMMIT_USER_LABEL = 'pipelinesascode.tekton.dev/sender',
  COMMIT_REPO_ORG_LABEL = 'pipelinesascode.tekton.dev/url-org',
  COMMIT_REPO_URL_LABEL = 'pipelinesascode.tekton.dev/url-repository',
  COMMIT_FULL_REPO_URL_LABEL = 'pipelinesascode.tekton.dev/repo-url',
  COMMIT_PROVIDER_LABEL = 'pipelinesascode.tekton.dev/git-provider',
  COMMIT_SHA_TITLE_ANNOTATION = 'pipelinesascode.tekton.dev/sha-title',
}

export enum PipelineRunType {
  BUILD = 'build',
  RELEASE = 'release',
  TEST = 'test',
}
