export enum PipelineResourceType {
  git = 'git',
  image = 'image',
  cluster = 'cluster',
  storage = 'storage',
}

export enum VolumeTypes {
  NoWorkspace = 'noWorkspace',
  EmptyDirectory = 'emptyDirectory',
  ConfigMap = 'configMap',
  Secret = 'secret',
  PVC = 'pvc',
  VolumeClaimTemplate = 'volumeClaimTemplate',
}

export enum SecretAnnotationId {
  Git = 'git',
  Image = 'docker',
}

export const preferredNameAnnotation = 'pipeline.openshift.io/preferredName';

export const PIPELINE_SERVICE_ACCOUNT = 'appstudio-pipeline';

export const PIPELINE_NAMESPACE = 'openshift-pipelines';
