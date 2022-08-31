import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, fireEvent, waitFor, render } from '@testing-library/react';
import { MockIntegrationTests } from '../__data__/mock-integration-tests';
import IntegrationTestsListView from '../IntegrationTestsListView';

const navigateMock = jest.fn();

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useNavigate: () => navigateMock,
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;

configure({ testIdAttribute: 'data-test' });

describe('IntegrationTestsListView', () => {
  it('should render the skeleton table if integration tests data is not loaded', () => {
    useK8sWatchResourceMock.mockReturnValue([[], false]);
    const wrapper = render(<IntegrationTestsListView applicationName="test-app" />);
    expect(wrapper.findByText('No integration test pipelines found yet.')).toBeTruthy();
  });

  it('should render the empty state if there are no integration tests', () => {
    useK8sWatchResourceMock.mockReturnValue([[], true, undefined]);
    const wrapper = render(<IntegrationTestsListView applicationName="test-app" />);
    expect(wrapper.findByText('No integration test pipelines found yet.')).toBeTruthy();
  });

  it('should render a table when there are integration tests', () => {
    useK8sWatchResourceMock.mockReturnValue([MockIntegrationTests, true, undefined]);
    const wrapper = render(<IntegrationTestsListView applicationName="test-app" />);
    expect(wrapper.container.getElementsByTagName('table')).toHaveLength(1);
  });

  it('should show the add integration test page on Add action', async () => {
    useK8sWatchResourceMock.mockReturnValue([[], true, undefined]);
    const wrapper = render(<IntegrationTestsListView applicationName="test-app" />);
    const addButton = wrapper.getByTestId('add-integration-test');
    fireEvent.click(addButton);

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(
        '/app-studio/applications/test-app/integration-test',
      ),
    );
  });
});
