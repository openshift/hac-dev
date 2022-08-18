export enum PipelineRunLabel {
  APPLICATION = 'appstudio.openshift.io/application',
  COMPONENT = 'appstudio.openshift.io/component',
  PIPELINE_TYPE = 'pipelines.appstudio.openshift.io/type',
}

export enum PipelineRunType {
  BUILD = 'build',
  RELEASE = 'release',
  TEST = 'test',
}
