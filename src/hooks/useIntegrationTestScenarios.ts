import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { IntegrationTestScenarioGroupVersionKind } from '../models';
import { IntegrationTestScenarioKind } from '../types/coreBuildService';

export const useIntegrationTestScenario = (
  namespace: string,
  applicationName: string,
  testName: string,
): [IntegrationTestScenarioKind, boolean, unknown] => {
  const [tests, testsLoaded, error] = useK8sWatchResource<IntegrationTestScenarioKind[]>({
    groupVersionKind: IntegrationTestScenarioGroupVersionKind,
    name: testName,
    namespace,
    isList: true,
  });

  return React.useMemo(() => {
    if (testsLoaded && !error) {
      const test = tests.find(
        (t) => t.spec.application === applicationName && !t.metadata.deletionTimestamp,
      );
      if (!test) {
        return [null, testsLoaded, { code: 404 }];
      }
      return [test, testsLoaded, error];
    }

    return [null, testsLoaded, error];
  }, [testsLoaded, tests, error, applicationName]);
};

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
    () =>
      testsLoaded
        ? tests?.filter(
            (c) => c.spec.application === applicationName && !c.metadata.deletionTimestamp,
          ) || []
        : [],
    [tests, applicationName, testsLoaded],
  );

  return [integrationTests, testsLoaded, error];
};
