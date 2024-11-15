import * as React from 'react';
import { PipelineRunLabel, PipelineRunType } from '../consts/pipelinerun';
import { PipelineRunKind } from '../types';
import { useComponents } from './useComponents';
import { usePipelineRuns } from './usePipelineRuns';

export const useLatestIntegrationTestPipelines = (
  namespace: string,
  applicationName: string,
  integrationTestNames: string[],
): [PipelineRunKind[], boolean, unknown] => {
  const [foundNames, setFoundNames] = React.useState<string[]>([]);
  const [latestTestPipelines, setLatestTestPipelines] = React.useState<PipelineRunKind[]>([]);

  const [components, componentsLoaded] = useComponents(namespace, applicationName);

  const componentNames = React.useMemo(
    () => (componentsLoaded ? components.map((c) => c.metadata?.name) : []),
    [components, componentsLoaded],
  );

  React.useEffect(() => {
    setFoundNames([]);
  }, [integrationTestNames]);

  const neededNames = React.useMemo(
    () => (integrationTestNames ? integrationTestNames.filter((n) => !foundNames.includes(n)) : []),
    [integrationTestNames, foundNames],
  );

  const [pipelineRuns, pipelineRunsLoaded, plrError, getNextPage] = usePipelineRuns(
    !componentsLoaded || !neededNames.length ? null : namespace,
    React.useMemo(
      () => ({
        selector: {
          matchLabels: {
            [PipelineRunLabel.APPLICATION]: applicationName,
            [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.TEST,
          },
          matchExpressions: [
            {
              key: PipelineRunLabel.TEST_SERVICE_SCENARIO,
              operator: 'In',
              values: neededNames,
            },
          ],
        },
      }),
      [applicationName, neededNames],
    ),
  );

  React.useEffect(() => {
    let canceled = false;

    if (plrError || !pipelineRunsLoaded || !componentNames || !pipelineRuns) {
      return;
    }

    const testRuns = neededNames.reduce((acc, integrationTestName) => {
      const testRun = pipelineRuns.find(
        (pipeline) =>
          pipeline.metadata?.labels?.[PipelineRunLabel.TEST_SERVICE_SCENARIO] ===
          integrationTestName,
      );
      if (testRun) {
        acc.push(testRun);
      }
      return acc;
    }, []);

    const newNames = testRuns.map(
      (testRun) => testRun.metadata.labels[PipelineRunLabel.TEST_SERVICE_SCENARIO],
    );

    if (!newNames.length) {
      if (neededNames.length) {
        getNextPage?.();
      }
    } else {
      if (!canceled) {
        setFoundNames((prev) => [...prev, ...newNames]);
        setLatestTestPipelines((prev) => [...prev, ...testRuns]);
      }
    }

    return () => {
      canceled = true;
    };
  }, [
    componentNames,
    getNextPage,
    integrationTestNames,
    neededNames,
    pipelineRuns,
    pipelineRunsLoaded,
    plrError,
  ]);

  return [
    latestTestPipelines,
    componentsLoaded && (neededNames.length === 0 || (pipelineRunsLoaded && !getNextPage)),
    plrError,
  ];
};
