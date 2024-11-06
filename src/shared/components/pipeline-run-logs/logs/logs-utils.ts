import {
  commonFetchText,
  getK8sResourceURL,
  k8sGetResource,
} from '@openshift/dynamic-plugin-sdk-utils';
import { saveAs } from 'file-saver';
import { PodModel } from '../../../../models/pod';
import { TaskRunKind } from '../../../../types';
import { getTaskRunLog } from '../../../../utils/tekton-results';
import { LineBuffer } from '../../../utils/line-buffer';
import { ContainerSpec, ContainerStatus, PodKind } from '../../types';
import { containerToLogSourceStatus, LOG_SOURCE_TERMINATED, LOG_SOURCE_WAITING } from '../utils';

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
  const containers: ContainerSpec[] = pod?.spec?.containers ?? [];
  const containerStatuses: ContainerStatus[] = pod?.status?.containerStatuses ?? [];

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
  return k8sGetResource({ model: PodModel, queryOptions: { name, ns } })
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
  sortedTaskRunNames: string[],
  taskRuns: TaskRunKind[],
  workspace: string,
  namespace: string,
  pipelineRunName: string,
  pipelineRunUID: string,
): (() => Promise<Error>) => {
  const getWatchUrls = async (): Promise<StepsWatchUrl> => {
    const stepsList: ContainerStatus[][] = await Promise.all(
      sortedTaskRunNames.map((currTask) => {
        const { status } = taskRuns.find((t) => t.metadata.name === currTask) ?? {};
        return getOrderedStepsFromPod(status?.podName, namespace);
      }),
    );
    return sortedTaskRunNames.reduce((acc, currTask, i) => {
      const taskRun = taskRuns.find((t) => t.metadata.name === currTask);
      const pipelineTaskName = taskRun?.spec.taskRef?.name ?? taskRun?.metadata.name;
      const status = taskRun.status;

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
            url: getK8sResourceURL(PodModel, undefined, urlOpts),
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
    let allLogs = '';
    for (const currTask of sortedTaskRunNames) {
      const task = tasks[currTask];
      const steps = Object.keys(task.steps);
      allLogs += `${task.name}\n\n`;

      if (steps.length > 0) {
        for (const step of steps) {
          const { url, status } = task.steps[step];
          const getContentPromise = commonFetchText(url).then((logs) => {
            return `${step.toUpperCase()}\n\n${logs}\n\n`;
          });
          allLogs +=
            status === LOG_SOURCE_TERMINATED
              ? // If we are done, we want this log content
                await getContentPromise
              : // If we are not done, let's not wait indefinitely
                await Promise.race([
                  getContentPromise,
                  new Promise<string>((resolve) => {
                    setTimeout(() => resolve(''), 1000);
                  }),
                ]);
        }
      } else {
        const taskRun = taskRuns.find((t) => t.metadata.name === currTask);
        allLogs += await getTaskRunLog(workspace, namespace, pipelineRunUID, taskRun).then(
          (log) => `${tasks[currTask].name.toUpperCase()}\n\n${log}\n\n`,
        );
      }
    }
    const buffer = new LineBuffer();
    buffer.ingest(allLogs);
    const blob = buffer.getBlob({
      type: 'text/plain;charset=utf-8',
    });
    saveAs(blob, `${pipelineRunName}.log`);
    return null;
  };
  return (): Promise<Error> => {
    return fetchLogs(getWatchUrls());
  };
};
