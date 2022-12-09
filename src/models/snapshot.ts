import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from '../dynamic-plugin-sdk';

export const SnapshotModel: K8sModelCommon = {
  apiGroup: 'appstudio.redhat.com',
  apiVersion: 'v1alpha1',
  kind: 'Snapshot',
  plural: 'snapshots',
  namespaced: true,
};

export const SnapshotGroupVersionKind: K8sGroupVersionKind = {
  group: SnapshotModel.apiGroup,
  version: SnapshotModel.apiVersion,
  kind: SnapshotModel.kind,
};
