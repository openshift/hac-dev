import * as React from 'react';
import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import DotCircleIcon from '@patternfly/react-icons/dist/js/icons/dot-circle-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import { global_danger_color_100 as redColor } from '@patternfly/react-tokens/dist/js/global_danger_color_100';
import { global_success_color_100 as greenColor } from '@patternfly/react-tokens/dist/js/global_success_color_100';
import { global_warning_color_100 as yellowColor } from '@patternfly/react-tokens/dist/js/global_warning_color_100';
import { ENTERPRISE_CONTRACT_STATUS, EnterpriseContractResult } from './types';

const ENTERPRISE_CONTRACT_LABEL = 'build.appstudio.redhat.com/pipeline';

export const isResourceEnterpriseContract = (resource: K8sResourceCommon): boolean => {
  return resource?.metadata?.labels[ENTERPRISE_CONTRACT_LABEL] === 'enterprise-contract';
};

export const getRuleStatus = (type: ENTERPRISE_CONTRACT_STATUS) => {
  switch (type) {
    case ENTERPRISE_CONTRACT_STATUS.successes:
      return (
        <>
          <CheckCircleIcon color={greenColor.value} /> {ENTERPRISE_CONTRACT_STATUS.successes}
        </>
      );
    case ENTERPRISE_CONTRACT_STATUS.violations:
      return (
        <>
          <ExclamationCircleIcon color={redColor.value} /> {ENTERPRISE_CONTRACT_STATUS.violations}
        </>
      );
    case ENTERPRISE_CONTRACT_STATUS.warnings:
      return (
        <>
          <ExclamationTriangleIcon color={yellowColor.value} />{' '}
          {ENTERPRISE_CONTRACT_STATUS.warnings}
        </>
      );
    default:
      return (
        <>
          <DotCircleIcon /> Missing
        </>
      );
  }
};

/**
 * This regex expect the logs from tekton results to be in this formay
 *
 * ```
 * step-vulnerabilities :-
 * Lorem Ipsum some logs
 *
 * step-report-json :-
 * {"success":true,"components":[{"name":"devfile-sample-code-with-quarkus-1",<... ec report in JSON ...>,}]}
 *
 * ```
 *
 */
const EC_REPORT_JSON_REGEX = /((?<=step-report-json\s*:-\s*)(\{.*?\})(?=\s*step-|$))/g;

export const extractEcResultsFromTaskRunLogs = (logs: string): EnterpriseContractResult => {
  const extractedLogs = logs.match(EC_REPORT_JSON_REGEX);
  try {
    return JSON.parse(extractedLogs[0]);
  } catch {
    return null;
  }
};
