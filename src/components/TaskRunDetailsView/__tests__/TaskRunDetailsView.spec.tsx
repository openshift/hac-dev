import * as React from 'react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { useTaskRun } from '../../../hooks/usePipelineRuns';
import { routerRenderer } from '../../../utils/test-utils';
import { testTaskRuns } from '../../TaskRunListView/__data__/mock-TaskRun-data';
import { TaskRunDetailsView } from '../TaskRunDetailsView';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  k8sCreateResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

const navigateMock = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props) => <a href={props.to}>{props.children}</a>,
    useNavigate: () => navigateMock,
    useSearchParams: () => React.useState(() => new URLSearchParams()),
  };
});

jest.mock('../../../hooks/usePipelineRuns', () => ({
  useTaskRun: jest.fn(),
}));

const useTaskRunMock = useTaskRun as jest.Mock;
// const sanitizeHtmlMock = sanitizeHtml as jest.Mock;

describe('TaskRunDetailsView', () => {
  const taskrunName = testTaskRuns[0].metadata.name;
  it('should render spinner if taskrun data is not loaded', () => {
    useTaskRunMock.mockReturnValue([null, false]);
    routerRenderer(<TaskRunDetailsView taskRunName={taskrunName} />);
    screen.getByRole('progressbar');
  });

  it('should render the error state if the taskrun is not found', () => {
    useTaskRunMock.mockReturnValue([null, false, { code: 404 }]);
    routerRenderer(<TaskRunDetailsView taskRunName={taskrunName} />);
    screen.getByText('404: Page not found');
    screen.getByText('Go to applications list');
  });

  it('should render taskrun name if taskrun data is loaded', () => {
    useTaskRunMock.mockReturnValueOnce([testTaskRuns[0], true]).mockReturnValue([[], true]);
    routerRenderer(<TaskRunDetailsView taskRunName={taskrunName} />);
    screen.getAllByText(taskrunName);
  });

  it('should redirect to details when taskrun succeeded', () => {
    useTaskRunMock.mockReturnValueOnce([testTaskRuns[1], true]).mockReturnValue([[], true]);
    routerRenderer(<TaskRunDetailsView taskRunName={taskrunName} />);
    expect(navigateMock).toHaveBeenLastCalledWith(
      '/application-pipeline/workspaces//applications/app/taskruns/example/details',
    );
    screen.getAllByText(taskrunName);
  });

  it('should redirect to logs when taskrun failed', () => {
    useTaskRunMock.mockReturnValueOnce([testTaskRuns[0], true]).mockReturnValue([[], true]);
    routerRenderer(<TaskRunDetailsView taskRunName={taskrunName} />);
    expect(navigateMock).toHaveBeenCalledWith(
      '/application-pipeline/workspaces//applications/example-app/taskruns/example/logs',
    );
    screen.getAllByText(taskrunName);
  });
});
