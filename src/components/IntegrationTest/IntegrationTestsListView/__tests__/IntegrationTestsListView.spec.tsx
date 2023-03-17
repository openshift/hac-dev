import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, fireEvent, waitFor, render } from '@testing-library/react';
import { useSearchParam } from '../../../../hooks/useSearchParam';
import { MockIntegrationTests } from '../__data__/mock-integration-tests';
import IntegrationTestsListView from '../IntegrationTestsListView';

const navigateMock = jest.fn();

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useNavigate: () => navigateMock,
}));

jest.mock('../../../../hooks/useSearchParam', () => ({
  useSearchParam: jest.fn(),
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

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;
const useSearchParamMock = useSearchParam as jest.Mock;

configure({ testIdAttribute: 'data-test' });

const params: any = {};

const mockUseSearchParam = (name: string) => {
  const setter = (value) => {
    params[name] = value;
  };
  const unset = () => {
    params[name] = '';
  };
  return [params[name], setter, unset];
};

describe('IntegrationTestsListView', () => {
  beforeEach(() => {
    useSearchParamMock.mockImplementation(mockUseSearchParam);
  });

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
  });

  it('should show the add integration test page on Add action', async () => {
    useK8sWatchResourceMock.mockReturnValue([[], true, undefined]);
    const wrapper = render(<IntegrationTestsListView applicationName="test-app" />);
    const addButton = wrapper.getByTestId('add-integration-test');
    fireEvent.click(addButton);

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(
        '/stonesoup/workspaces/test-ws/applications/test-app/integrationtests/add',
      ),
    );
  });
});
