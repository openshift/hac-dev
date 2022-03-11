import { saveAs } from 'file-saver';
import { consoleFetchText, k8sGetResource, resourceURL } from '../../../../dynamic-plugin-sdk';
import { LineBuffer } from '../../../utils/line-buffer';
import { ContainerSpec, ContainerStatus, PodKind } from '../../types';
import { PLRTaskRunData, PLRTaskRuns } from '../types';
import {
  containerToLogSourceStatus,
  LOG_SOURCE_TERMINATED,
  LOG_SOURCE_WAITING,
  PodModel,
} from '../utils';

const getSortedContainerStatus = (
  containers: ContainerSpec[],
  containerStatuses: ContainerStatus[],
): ContainerStatus[] => {
  const containerNames = containers.map((c) => c.name);
  const sortedContainerStatus = [];
  containerStatuses.forEach((cs) => {
    const containerIndex = containerNames.indexOf(cs.name);
    sortedContainerStatus[containerIndex] = cs;
  });
  return sortedContainerStatus;
};

export const getRenderContainers = (
  pod: PodKind,
): { containers: ContainerSpec[]; stillFetching: boolean } => {
  const containers: ContainerSpec[] = pod.spec?.containers ?? [];
  const containerStatuses: ContainerStatus[] = pod.status?.containerStatuses ?? [];

  const sortedContainerStatuses = getSortedContainerStatus(containers, containerStatuses);

  const firstRunningCont = sortedContainerStatuses.findIndex(
    (container) => containerToLogSourceStatus(container) !== LOG_SOURCE_TERMINATED,
  );
  return {
    containers: containers.slice(
      0,
      firstRunningCont === -1 ? containers.length : firstRunningCont + 1,
    ),
    stillFetching: firstRunningCont !== -1,
  };
};

const getOrderedStepsFromPod = (name: string, ns: string): Promise<ContainerStatus[]> => {
  return k8sGetResource({ model: PodModel, name, ns })
    .then((pod: PodKind) => {
      return getSortedContainerStatus(
        pod.spec.containers ?? [],
        pod.status?.containerStatuses ?? [],
      );
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.warn('Error Downloading logs', err);
      return [];
    });
};

type StepsWatchUrl = {
  [key: string]: {
    name: string;
    steps: { [step: string]: WatchURLStatus };
  };
};

type WatchURLStatus = {
  status: string;
  url: string;
};

export const getDownloadAllLogsCallback = (
  sortedTaskRuns: string[],
  taskRunFromYaml: PLRTaskRuns,
  namespace: string,
  pipelineRunName: string,
): (() => Promise<Error>) => {
  const getWatchUrls = async (): Promise<StepsWatchUrl> => {
    const stepsList: ContainerStatus[][] = await Promise.all(
      sortedTaskRuns.map((currTask) => {
        const { status } = taskRunFromYaml[currTask] as PLRTaskRunData;
        return getOrderedStepsFromPod(status?.podName, namespace);
      }),
    );
    return sortedTaskRuns.reduce((acc, currTask, i) => {
      const { pipelineTaskName, status } = taskRunFromYaml[currTask];
      const podName = status?.podName;
      const steps = stepsList[i];
      const allStepUrls = steps.reduce((stepUrls, currentStep) => {
        const { name } = currentStep;
        const currentStatus = containerToLogSourceStatus(currentStep);
        if (currentStatus === LOG_SOURCE_WAITING) return stepUrls;
        const urlOpts = {
          ns: namespace,
          name: podName,
          path: 'log',
          queryParams: {
            container: name,
            follow: 'true',
          },
        };
        return {
          ...stepUrls,
          [name]: {
            status: currentStatus,
            url: resourceURL(PodModel, urlOpts),
          } as WatchURLStatus,
        };
      }, {});
      acc[currTask] = {
        name: pipelineTaskName,
        steps: { ...allStepUrls },
      };
      return acc;
    }, {});
  };

  const fetchLogs = async (tasksPromise: Promise<StepsWatchUrl>) => {
    const tasks = await tasksPromise;
    const allRequests: Promise<string>[] = sortedTaskRuns.reduce((acc, currTask) => {
      const task = tasks[currTask];
      const promises: Promise<string>[] = Object.keys(task.steps).map((step, i) => {
        let heading = '';
        if (i === 0) {
          heading += `${task.name}\n\n`;
        }
        heading += `${step}\n\n`;
        const { url, status } = task.steps[step];
        const getContentPromise = consoleFetchText(url).then((logs) => {
          return `${heading}${logs}\n\n`;
        });
        if (status === LOG_SOURCE_TERMINATED) {
          // If we are done, we want this log content
          return getContentPromise;
        }
        // If we are not done, let's not wait indefinitely
        return Promise.race([
          getContentPromise,
          new Promise<string>((resolve) => {
            setTimeout(() => resolve(''), 1000);
          }),
        ]);
      });
      return [...acc, ...promises];
    }, []);
    const buffer = new LineBuffer();
    return Promise.all(allRequests).then((allLogs) => {
      buffer.ingest(allLogs.join(''));
      const blob = buffer.getBlob({
        type: 'text/plain;charset=utf-8',
      });
      saveAs(blob, `${pipelineRunName}.log`);
      return null;
    });
  };
  return (): Promise<Error> => {
    return fetchLogs(getWatchUrls());
  };
};
