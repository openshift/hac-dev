import { commonFetchText, getK8sResourceURL } from '@openshift/dynamic-plugin-sdk-utils';
import { waitFor } from '@testing-library/react';
import { saveAs } from 'file-saver';
import { samplePod } from '../../../../__data__/pod-data';
import { mockTaskRunsWithOwnerRef } from '../../../../components/TaskRunListView/__data__/mock-TaskRun-data';
import { getTaskRunLog } from '../../../../utils/tekton-results';
import { getRenderContainers, getDownloadAllLogsCallback } from './logs-utils';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => {
  const actual = jest.requireActual('@openshift/dynamic-plugin-sdk-utils');
  return {
    ...actual,
    commonFetchText: jest.fn(),
    getK8sResourceURL: jest.fn(),
  };
});

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

jest.mock('../../../../utils/tekton-results', () => {
  const actual = jest.requireActual('../../../../utils/tekton-results');
  return {
    ...actual,
    getTaskRunLog: jest.fn(),
  };
});

const commonFetchTextMock = commonFetchText as jest.Mock;
const getK8sResourceURLMock = getK8sResourceURL as jest.Mock;
const getTaskRunLogMock = getTaskRunLog as jest.Mock;
const fileSaverMock = saveAs as jest.Mock;

describe('getRenderContainers', () => {
  it('should render default values if invalid value is passed', () => {
    expect(getRenderContainers(null)).toEqual({
      containers: [],
      stillFetching: false,
    });
  });

  it('should render containers for the given pod', () => {
    expect(getRenderContainers(samplePod)).toEqual({
      containers: samplePod.spec.containers,
      stillFetching: false,
    });
  });
});

describe('getDownloadAllLogsCallback', () => {
  beforeEach(() => {
    commonFetchTextMock.mockReturnValue('test1');
    getK8sResourceURLMock.mockReturnValue('test1');
    getTaskRunLogMock.mockReturnValue(Promise.resolve('test1'));
    fileSaverMock.mockReturnValue('file');
  });
  it('should call getTaskRunLogs once', async () => {
    const callBack = getDownloadAllLogsCallback(
      ['task1'],
      [mockTaskRunsWithOwnerRef[0]],
      'ws1',
      'ns1',
      'plr-test',
    );
    callBack();
    await waitFor(() => {
      expect(getTaskRunLogMock).toHaveBeenCalled();
      expect(getTaskRunLogMock).toHaveBeenCalledWith('ws1', 'ns1', 'plr-uid', 'task-1');
    });
  });

  it('should call getTaskRunLogs twice for two tasks', async () => {
    getTaskRunLogMock.mockClear().mockReturnValue(Promise.resolve('test1'));
    const callBack = getDownloadAllLogsCallback(
      ['task1', 'task2'],
      mockTaskRunsWithOwnerRef,
      'ws1',
      'ns1',
      'plr-test',
    );
    callBack();
    await waitFor(() => {
      expect(getTaskRunLogMock).toHaveBeenCalledTimes(2);
      expect(getTaskRunLogMock).toHaveBeenLastCalledWith('ws1', 'ns1', 'plr-uid', 'task-2');
    });
  });

  it('should save log in correct filename', async () => {
    fileSaverMock.mockClear().mockImplementation((a, b) => b);
    const callBack = getDownloadAllLogsCallback(
      ['task1', 'task2'],
      mockTaskRunsWithOwnerRef,
      'ws1',
      'ns1',
      'plr-test',
    );
    callBack();
    await waitFor(() => {
      expect(fileSaverMock).toHaveBeenCalled();
      expect(fileSaverMock).toHaveLastReturnedWith('plr-test.log');
    });
  });
});
