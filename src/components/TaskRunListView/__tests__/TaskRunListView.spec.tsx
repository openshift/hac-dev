import * as React from 'react';
import { render, configure, screen } from '@testing-library/react';
import { useSearchParam } from '../../../hooks/useSearchParam';
import { testTaskRuns } from '../__data__/mock-TaskRun-data';
import TaskRunListView from '../TaskRunListView';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../hooks/useSearchParam', () => ({
  useSearchParam: jest.fn(),
}));

configure({ testIdAttribute: 'data-test' });

const mockUseSearchParam = useSearchParam as jest.Mock;

describe('TaskRunListView', () => {
  it('should render progress indicator while loading', async () => {
    mockUseSearchParam.mockReturnValueOnce(['']);
    const wrapper = render(<TaskRunListView taskRuns={[]} loaded={false} />);
    expect(await wrapper.findByRole('progressbar')).toBeTruthy();
  });

  it('should render empty state when no TaskRuns present', () => {
    mockUseSearchParam.mockReturnValueOnce(['']);
    const wrapper = render(<TaskRunListView taskRuns={[]} loaded={false} />);
    expect(wrapper.findByText('No task runs found')).toBeTruthy();
  });

  it('should render table', () => {
    mockUseSearchParam.mockReturnValueOnce(['']);
    const wrapper = render(<TaskRunListView taskRuns={testTaskRuns} loaded={true} />);
    const table = wrapper.container.getElementsByTagName('table');
    expect(table).toHaveLength(1);
  });

  it('should render filter toolbar', () => {
    mockUseSearchParam.mockReturnValueOnce(['']);
    const wrapper = render(<TaskRunListView taskRuns={testTaskRuns} loaded={true} />);
    screen.getByTestId('taskrun-list-toolbar');
    expect(wrapper.container.getElementsByTagName('table')).toHaveLength(1);
    expect(wrapper.container.getElementsByTagName('tr')).toHaveLength(1);
  });
});
