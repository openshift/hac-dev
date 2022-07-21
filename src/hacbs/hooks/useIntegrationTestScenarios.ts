import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { IntegrationTestScenarioGroupVersionKind } from '../models';
import { IntegrationTestScenarioKind } from '../types/coreBuildService';

export const useIntegrationTestScenarios = (
  namespace: string,
  applicationName: string,
): [IntegrationTestScenarioKind[], boolean, unknown] => {
  const [tests, testsLoaded, error] = useK8sWatchResource<IntegrationTestScenarioKind[]>({
    groupVersionKind: IntegrationTestScenarioGroupVersionKind,
    namespace,
    isList: true,
  });

  const integrationTests = React.useMemo(
    () => (testsLoaded ? tests?.filter((c) => c.spec.application === applicationName) || [] : []),
    [tests, applicationName, testsLoaded],
  );

  return [integrationTests, testsLoaded, error];
};
