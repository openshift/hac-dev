/* eslint-disable */
import {
  K8sResourceCommon,
} from '@openshift/dynamic-plugin-sdk-utils';

/* ---------------- *
 *  Internal Types  *
 * ---------------- */
enum Operator {
  Exists = 'Exists',
  DoesNotExist = 'DoesNotExist',
  In = 'In',
  NotIn = 'NotIn',
  Equals = 'Equals',
  NotEqual = 'NotEqual',
  GreaterThan = 'GreaterThan',
  LessThan = 'LessThan',
  NotEquals = 'NotEquals',
}
type MatchExpression = {
  key: string;
  operator: Operator | string;
  values?: string[];
  value?: string;
};
type MatchLabels = {
  [key: string]: string;
};
type Selector = {
  matchLabels?: MatchLabels;
  matchExpressions?: MatchExpression[];
};


/* ---------------- *
 *  External Types  *
 * ---------------- */
export type K8sGroupVersionKind = { group?: string; version: string; kind: string };
export type WatchK8sResource = {
  groupVersionKind: K8sGroupVersionKind;
  name?: string;
  namespace?: string;
  isList?: boolean;
  selector?: Selector;
  namespaced?: boolean;
  limit?: number;
  fieldSelector?: string;
  optional?: boolean;
};
export type WatchK8sResult<R extends K8sResourceCommon | K8sResourceCommon[]> = [R, boolean, any];
