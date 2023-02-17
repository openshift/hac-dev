import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, configure, screen } from '@testing-library/react';
import { useSearchParam } from '../../../hooks/useSearchParam';
import { testTaskRuns } from '../__data__/mock-TaskRun-data';
import TaskRunListView from '../TaskRunListView';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../hooks/useSearchParam', () => ({
  useSearchParam: jest.fn(),
}));

configure({ testIdAttribute: 'data-test' });

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;
const mockUseSearchParam = useSearchParam as jest.Mock;

describe('TaskRunListView', () => {
  it('should render progress indicator while loading', async () => {
    useK8sWatchResourceMock.mockReturnValue([undefined, false, undefined]);
    mockUseSearchParam.mockReturnValueOnce(['']);
    const wrapper = render(<TaskRunListView pipelineName="test-pipeline" namespace="test-ns" />);
    expect(await wrapper.findByRole('progressbar')).toBeTruthy();
  });

  it('should render empty state when no TaskRuns present', () => {
    useK8sWatchResourceMock.mockReturnValue([[], true, undefined]);
    mockUseSearchParam.mockReturnValueOnce(['']);
    const wrapper = render(<TaskRunListView pipelineName="test-pipeline" namespace="test-ns" />);
    expect(wrapper.findByText('No TaskRuns found')).toBeTruthy();
  });

  it('should render table', () => {
    useK8sWatchResourceMock.mockReturnValue([testTaskRuns, true, undefined]);
    mockUseSearchParam.mockReturnValueOnce(['']);
    const wrapper = render(<TaskRunListView pipelineName="test-pipeline" namespace="test-ns" />);
    const table = wrapper.container.getElementsByTagName('table');
    expect(table).toHaveLength(1);
  });

  it('should render filter toolbar', () => {
    useK8sWatchResourceMock.mockReturnValue([testTaskRuns, true, undefined]);
    mockUseSearchParam.mockReturnValueOnce(['']);
    const wrapper = render(<TaskRunListView pipelineName="test-pipeline" namespace="test-ns" />);
    screen.getByTestId('taskrun-list-toolbar');
    expect(wrapper.container.getElementsByTagName('table')).toHaveLength(1);
    expect(wrapper.container.getElementsByTagName('tr')).toHaveLength(1);
  });
});
