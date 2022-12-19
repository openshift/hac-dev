import merge from 'lodash/merge';
import { preferredNameAnnotation } from '../consts/pipeline';
import { PipelineRunModel } from '../models';
import { PipelineRunKind } from '../types';

export const getDuration = (seconds: number, long?: boolean): string => {
  if (!seconds || seconds <= 0) {
    return 'less than a sec';
  }
  let sec = Math.round(seconds);
  let min = 0;
  let hr = 0;
  let duration = '';
  if (sec >= 60) {
    min = Math.floor(sec / 60);
    sec %= 60;
  }
  if (min >= 60) {
    hr = Math.floor(min / 60);
    min %= 60;
  }
  if (hr > 0) {
    duration += long ? (hr === 1 ? `${hr} hour` : `${hr} hours`) : `${hr} h`;
    duration += ' ';
  }
  if (min > 0) {
    duration += long ? (min === 1 ? `${min} minute` : `${min} minutes`) : `${min} m`;
    duration += ' ';
  }
  if (sec > 0) {
    duration += long ? (sec === 1 ? `${sec} second` : `${sec} seconds`) : `${sec} s`;
  }

  return duration.trim();
};

export const calculateDuration = (startTime: string, endTime?: string) => {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : new Date().getTime();
  const durationInSeconds = (end - start) / 1000;
  return getDuration(durationInSeconds, true);
};

export const getRandomChars = (len = 6): string => {
  return Math.random()
    .toString(36)
    .replace(/[^a-z0-9]+/g, '')
    .slice(2, len + 2);
};

export const getPipelineRunData = (
  latestRun: PipelineRunKind,
  options?: { generateName: boolean },
): PipelineRunKind => {
  if (!latestRun) {
    // eslint-disable-next-line no-console
    console.error('Missing parameters, unable to create new PipelineRun');
    return null;
  }
  const pipelineName =
    latestRun.spec.pipelineRef?.name ??
    (latestRun.metadata.annotations?.[preferredNameAnnotation] || latestRun.metadata.name);

  const resources = latestRun?.spec.resources;
  const workspaces = latestRun?.spec.workspaces;
  const params = latestRun?.spec.params;

  const annotations = merge(
    {},
    latestRun?.metadata?.annotations,
    !latestRun?.spec.pipelineRef &&
      !latestRun?.metadata.annotations?.[preferredNameAnnotation] && {
        [preferredNameAnnotation]: pipelineName,
      },
  );
  //should not propagate this last-applied-configuration to a new pipelinerun.
  delete annotations['kubectl.kubernetes.io/last-applied-configuration'];

  const newPipelineRun = {
    apiVersion: latestRun.apiVersion,
    kind: PipelineRunModel.kind,
    metadata: {
      ...(options?.generateName
        ? {
            generateName: `${pipelineName}-`,
          }
        : {
            name: `${pipelineName}-${getRandomChars()}`,
          }),
      annotations,
      namespace: latestRun.metadata.namespace,
      labels: merge(
        {},
        latestRun?.metadata?.labels,
        latestRun?.spec.pipelineRef && {
          'tekton.dev/pipeline': pipelineName,
        },
      ),
    },
    spec: {
      ...(latestRun?.spec || {}),
      ...(latestRun?.spec.pipelineRef && {
        pipelineRef: {
          name: pipelineName,
        },
      }),
      resources,
      ...(params && { params }),
      workspaces,
      status: null,
    },
  };
  return newPipelineRun;
};
