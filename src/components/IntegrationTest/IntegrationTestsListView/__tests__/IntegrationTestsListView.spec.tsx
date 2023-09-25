import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, fireEvent, waitFor, render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockIntegrationTests } from '../__data__/mock-integration-tests';
import IntegrationTestsListView from '../IntegrationTestsListView';

const navigateMock = jest.fn();

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useSearchParams: () => React.useState(() => new URLSearchParams()),
  useNavigate: () => navigateMock,
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

jest.mock('../../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;

configure({ testIdAttribute: 'data-test' });

describe('IntegrationTestsListView', () => {
  it('should render the skeleton table if integration tests data is not loaded', () => {
    useK8sWatchResourceMock.mockReturnValue([[], false]);
    const wrapper = render(<IntegrationTestsListView applicationName="test-app" />);
    expect(wrapper.findByText('Test any code changes')).toBeTruthy();
  });

  it('should render the empty state if there are no integration tests', () => {
    useK8sWatchResourceMock.mockReturnValue([[], true, undefined]);
    const wrapper = render(<IntegrationTestsListView applicationName="test-app" />);
    expect(wrapper.findByText('Test any code changes')).toBeTruthy();
  });

  it('should render a table when there are integration tests', () => {
    useK8sWatchResourceMock.mockReturnValue([MockIntegrationTests, true, undefined]);
    const wrapper = render(<IntegrationTestsListView applicationName="test-app" />);
    expect(wrapper.container.getElementsByTagName('table')).toHaveLength(1);
    expect(wrapper.container.getElementsByTagName('tr')).toHaveLength(3);
    expect(screen.getByText('test-app-test-1'));
    expect(screen.getByText('test-app-test-2'));
  });

  it('should filter the table when a name is entered', () => {
    useK8sWatchResourceMock.mockReturnValue([MockIntegrationTests, true, undefined]);
    render(<IntegrationTestsListView applicationName="test-app" />);

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Filter by name...');
    act(() => {
      fireEvent.change(filter, {
        target: { value: 'test-app-test-1' },
      });
    });
    expect(screen.getByText('test-app-test-1'));
    expect(screen.queryByText('test-app-test-2')).not.toBeInTheDocument();
  });

  it('should handle no matched tests', () => {
    useK8sWatchResourceMock.mockReturnValue([MockIntegrationTests, true, undefined]);
    const view = render(<IntegrationTestsListView applicationName="test-app" />);

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Filter by name...');
    act(() => {
      fireEvent.change(filter, {
        target: { value: 'unmatched-name' },
      });
    });
    expect(screen.queryByText('test-app-test-1')).not.toBeInTheDocument();
    expect(screen.queryByText('test-app-test-2')).not.toBeInTheDocument();

    // clear the filter
    const clearFilterButton = view.getAllByRole('button', { name: 'Clear all filters' })[0];
    fireEvent.click(clearFilterButton);

    expect(screen.queryByText('test-app-test-1')).toBeInTheDocument();
    expect(screen.queryByText('test-app-test-2')).toBeInTheDocument();
  });

  it('should show button to add integration test and it should redirect to add integration page', async () => {
    useK8sWatchResourceMock.mockReturnValue([MockIntegrationTests, true, undefined]);
    const integrationListView = render(<IntegrationTestsListView applicationName="test-app" />);
    fireEvent.click(integrationListView.getByTestId('add-integration-test'));

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(
        '/application-pipeline/workspaces/test-ws/applications/test-app/integrationtests/add',
      ),
    );
  });

  it('should show the add integration test page on Add action', async () => {
    useK8sWatchResourceMock.mockReturnValue([[], true, undefined]);
    const wrapper = render(<IntegrationTestsListView applicationName="test-app" />);
    const addButton = wrapper.getByTestId('add-integration-test');
    fireEvent.click(addButton);

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(
        '/application-pipeline/workspaces/test-ws/applications/test-app/integrationtests/add',
      ),
    );
  });
});
