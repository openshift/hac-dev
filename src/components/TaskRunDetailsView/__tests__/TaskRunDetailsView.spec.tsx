import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { screen } from '@testing-library/react';
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

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props) => <a href={props.to}>{props.children}</a>,
    useNavigate: jest.fn(),
    useSearchParams: () => React.useState(() => new URLSearchParams()),
  };
});

const watchResourceMock = useK8sWatchResource as jest.Mock;
// const sanitizeHtmlMock = sanitizeHtml as jest.Mock;

describe('TaskRunDetailsView', () => {
  const taskrunName = testTaskRuns[0].metadata.name;
  it('should render spinner if taskrun data is not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    routerRenderer(<TaskRunDetailsView taskRunName={taskrunName} />);
    screen.getByRole('progressbar');
  });

  it('should render the error state if the taskrun is not found', () => {
    watchResourceMock.mockReturnValue([[], false, { code: 404 }]);
    routerRenderer(<TaskRunDetailsView taskRunName={taskrunName} />);
    screen.getByText('404: Page not found');
    screen.getByText('Go to applications list');
  });

  it('should render the error state if the taskrun is being deleted', () => {
    const deletedTaskRun = {
      ...testTaskRuns[0],
      metadata: { ...testTaskRuns[0].metadata, deletionTimestamp: '1' },
    };
    watchResourceMock.mockReturnValueOnce([deletedTaskRun, true]).mockReturnValue([[], true]);
    routerRenderer(<TaskRunDetailsView taskRunName={taskrunName} />);
    screen.getByText('404: Page not found');
    screen.getByText('Go to applications list');
  });

  it('should render taskrun name if taskrun data is loaded', () => {
    watchResourceMock.mockReturnValueOnce([testTaskRuns[0], true]).mockReturnValue([[], true]);
    routerRenderer(<TaskRunDetailsView taskRunName={taskrunName} />);
    screen.getAllByText(taskrunName);
  });
});
