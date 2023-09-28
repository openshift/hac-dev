import * as React from 'react';
import { PipelineRunLabel, PipelineRunType } from '../consts/pipelinerun';
import { PipelineRunKind } from '../types';
import { usePipelineRuns } from './usePipelineRuns';

export const useLatestBuildPipelines = (
  namespace: string,
  applicationName: string,
  componentNames: string[] | undefined,
): [PipelineRunKind[], boolean, unknown] => {
  const [foundNames, setFoundNames] = React.useState<string[]>([]);
  const [latestBuilds, setLatestBuilds] = React.useState<PipelineRunKind[]>([]);

  React.useEffect(() => {
    setFoundNames([]);
  }, [componentNames]);

  const neededNames = React.useMemo(
    () => (componentNames ? componentNames.filter((n) => !foundNames.includes(n)) : []),
    [componentNames, foundNames],
  );

  const [pipelines, loaded, error, getNextPage] = usePipelineRuns(
    neededNames?.length ? namespace : null,
    React.useMemo(
      () => ({
        selector: {
          matchLabels: {
            [PipelineRunLabel.APPLICATION]: applicationName,
            [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.BUILD,
          },
          matchExpressions: [
            {
              key: PipelineRunLabel.COMPONENT,
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

    if (error || !loaded || !componentNames || !pipelines) {
      return;
    }

    const builds = neededNames.reduce((acc, componentName) => {
      const build = pipelines.find(
        (pipeline) => pipeline.metadata?.labels?.[PipelineRunLabel.COMPONENT] === componentName,
      );
      if (build) {
        acc.push(build);
      }
      return acc;
    }, []);

    const newNames = builds.map((build) => build.metadata.labels[PipelineRunLabel.COMPONENT]);

    if (!newNames.length) {
      if (neededNames.length) {
        getNextPage?.();
      }
    } else {
      if (!canceled) {
        if (builds.length) {
          setFoundNames((prev) => [...prev, ...newNames]);
          setLatestBuilds((prev) => [...prev, ...builds]);
        }
      }
    }

    return () => {
      canceled = true;
    };
  }, [componentNames, error, getNextPage, loaded, neededNames, pipelines]);

  return [latestBuilds, neededNames.length === 0 || (loaded && !getNextPage), error];
};
