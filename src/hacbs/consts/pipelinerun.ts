export enum PipelineRunLabel {
  APPLICATION = 'build.appstudio.openshift.io/application',
  COMPONENT = 'build.appstudio.openshift.io/component',
  PIPELINE_TYPE = 'pipelines.appstudio.openshift.io/type',
}

export enum PipelineRunType {
  BUILD = 'build',
  RELEASE = 'release',
  TEST = 'test',
}
