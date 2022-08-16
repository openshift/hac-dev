import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render } from '@testing-library/react';
import { testTaskRun } from '../__data__/mock-TaskRun-data';
import TaskRunListView from '../TaskRunListView';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;

describe('TaskRunListView', () => {
  it('should render progress indicator while loading', async () => {
    useK8sWatchResourceMock.mockReturnValue([undefined, false, undefined]);
    const wrapper = render(<TaskRunListView pipelineName="test-pipeline" namespace="test-ns" />);
    expect(await wrapper.findByRole('progressbar')).toBeTruthy();
  });

  it('should render empty state when no TaskRuns present', () => {
    useK8sWatchResourceMock.mockReturnValue([[], true, undefined]);
    const wrapper = render(<TaskRunListView pipelineName="test-pipeline" namespace="test-ns" />);
    expect(wrapper.findByText('No TaskRuns found')).toBeTruthy();
  });

  it('should render table', () => {
    useK8sWatchResourceMock.mockReturnValue([[testTaskRun], true, undefined]);
    const wrapper = render(<TaskRunListView pipelineName="test-pipeline" namespace="test-ns" />);
    expect(wrapper.container.getElementsByTagName('table')).toHaveLength(1);
  });
});
