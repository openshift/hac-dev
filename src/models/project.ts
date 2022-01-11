import { K8sModel } from './../dynamic-plugin-sdk';

export const ProjectModel: K8sModel = {
  apiVersion: 'v1',
  apiGroup: 'project.openshift.io',
  kind: 'Project',
  abbr: 'PR',
  label: 'Project',
  labelPlural: 'Projects',
  plural: 'projects',
};
