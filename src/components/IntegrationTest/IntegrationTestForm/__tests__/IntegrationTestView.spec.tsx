import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, fireEvent, render, RenderResult, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockComponents } from '../../../../components/Commits/CommitDetails/visualization/__data__/MockCommitWorkflowData';
import { useApplications } from '../../../../hooks/useApplications';
import { useComponents } from '../../../../hooks/useComponents';
import { useReleasePlans } from '../../../../hooks/useReleasePlans';
import { namespaceRenderer } from '../../../../utils/test-utils';
import { WorkspaceContext } from '../../../../utils/workspace-context-utils';
import { mockApplication } from '../../../ApplicationDetails/__data__/mock-data';
import { MockIntegrationTestsWithGit } from '../../IntegrationTestsListView/__data__/mock-integration-tests';
import IntegrationTestView from '../IntegrationTestView';
import { createIntegrationTest } from '../utils/create-utils';

jest.mock('../../../../utils/analytics');
jest.mock('@openshift/dynamic-plugin-sdk-utils');

jest.mock('../../../../hooks/useReleasePlans', () => ({
  useReleasePlans: jest.fn(),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;

const navigateMock = jest.fn();

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(() => ({})),
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useNavigate: () => navigateMock,
  useParams: jest.fn(() => ({
    appName: 'test-app',
  })),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('../utils/create-utils.ts', () => {
  const actual = jest.requireActual('../utils/create-utils.ts');
  return {
    ...actual,
    createIntegrationTest: jest.fn(),
  };
});

jest.mock('../../../../hooks/useApplications', () => ({
  useApplications: jest.fn(),
}));

jest.mock('../../../../hooks/useComponents', () => ({
  // Used in ContextsField
  useComponents: jest.fn(),
}));

jest.mock('../../../../utils/workspace-context-utils', () => {
  const actual = jest.requireActual('../../../../utils/workspace-context-utils');
  return {
    ...actual,
    useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
  };
});

jest.mock('../../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

const createIntegrationTestMock = createIntegrationTest as jest.Mock;
const useReleasePlansMock = useReleasePlans as jest.Mock;
const mockUseComponents = useComponents as jest.Mock;

configure({ testIdAttribute: 'data-test' });

class MockResizeObserver {
  observe() {
    // do nothing
  }

  unobserve() {
    // do nothing
  }

  disconnect() {
    // do nothing
  }
}

window.ResizeObserver = MockResizeObserver;

const IntegrationTestViewWrapper = ({ children }) => (
  <WorkspaceContext.Provider
    value={{
      namespace: 'test-ns',
      lastUsedWorkspace: 'test-ws',
      workspace: 'test-ws',
      workspaceResource: undefined,
      workspacesLoaded: true,
      workspaces: [],
      updateWorkspace: jest.fn(),
    }}
  >
    {children}
  </WorkspaceContext.Provider>
);

const useApplicationsMock = useApplications as jest.Mock;

describe('IntegrationTestView', () => {
  beforeEach(() => {
    useApplicationsMock.mockReturnValue([[mockApplication], true]);
    watchResourceMock.mockReturnValueOnce([[], true]);
    useReleasePlansMock.mockReturnValue([[], true]);
    mockUseComponents.mockReturnValue([MockComponents, true]);
  });
  const fillIntegrationTestForm = (wrapper: RenderResult) => {
    fireEvent.input(wrapper.getByLabelText(/Integration test name/), {
      target: { value: 'new-test-name' },
    });
    fireEvent.input(wrapper.getByLabelText(/GitHub URL/), {
      target: { value: 'quay.io/kpavic/test-bundle:pipeline' },
    });
    fireEvent.input(wrapper.getByLabelText(/Revision/), {
      target: { value: 'new-test-pipeline' },
    });
    fireEvent.input(wrapper.getByLabelText(/Path in repository/), {
      target: { value: 'new-test-pipeline' },
    });
  };
  it('should render the form by default', async () => {
    const wrapper = render(
      <IntegrationTestViewWrapper>
        <IntegrationTestView applicationName="test-app" />
      </IntegrationTestViewWrapper>,
    );
    await expect(wrapper).toBeTruthy();

    wrapper.getByLabelText(/Integration test name/);
    wrapper.getByLabelText(/GitHub URL/);
    wrapper.getByLabelText(/Revision/);
    wrapper.getByLabelText(/Path in repository/);
    wrapper.getByRole('button', { name: 'Add integration test' });
  });

  it('should enable the submit button when there are no errors', async () => {
    const wrapper = render(
      <IntegrationTestViewWrapper>
        <IntegrationTestView applicationName="test-app" />
      </IntegrationTestViewWrapper>,
    );
    await expect(wrapper).toBeTruthy();

    const submitButton = wrapper.getByRole('button', { name: 'Add integration test' });
    expect(submitButton).toBeDisabled();
    fillIntegrationTestForm(wrapper);
    expect(submitButton).toBeEnabled();
  });

  it('should navigate to the integration test tab on submit', async () => {
    createIntegrationTestMock.mockImplementation(() =>
      Promise.resolve({
        metadata: {},
        spec: {},
      }),
    );
    const wrapper = namespaceRenderer(
      <IntegrationTestViewWrapper>
        <IntegrationTestView applicationName="test-app" />
      </IntegrationTestViewWrapper>,
    );
    await expect(wrapper).toBeTruthy();

    fillIntegrationTestForm(wrapper);

    const submitButton = wrapper.getByRole('button', { name: 'Add integration test' });
    expect(submitButton).toBeTruthy();
    expect(submitButton).toBeEnabled();

    await waitFor(() => fireEvent.click(submitButton));
    await waitFor(() => expect(createIntegrationTestMock).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(
        '/application-pipeline/workspaces/test-ws/applications/test-app/integrationtests',
      ),
    );
  });

  it('should init values from provided integration test', async () => {
    const integrationTest = MockIntegrationTestsWithGit[1];
    const wrapper = render(
      <IntegrationTestViewWrapper>
        <IntegrationTestView applicationName="test-app" integrationTest={integrationTest} />,
      </IntegrationTestViewWrapper>,
    );

    expect((await wrapper.getByLabelText(/Integration test name/)).getAttribute('value')).toBe(
      'test-app-test-2',
    );
    expect((await wrapper.getByLabelText(/GitHub URL/)).getAttribute('value')).toEqual('test-url2');
    expect((await wrapper.getByLabelText(/Revision/)).getAttribute('value')).toEqual('main2');

    expect((await wrapper.getByLabelText(/Path in repository/)).getAttribute('value')).toEqual(
      'test-path2',
    );
  });

  it('should be in edit mode', async () => {
    const integrationTest = MockIntegrationTestsWithGit[1];
    const wrapper = render(
      <IntegrationTestViewWrapper>
        <IntegrationTestView applicationName="test-app" integrationTest={integrationTest} />
      </IntegrationTestViewWrapper>,
    );

    expect(((await wrapper.getByText(/Save changes/)) as HTMLButtonElement).disabled).toBe(true);
    (await wrapper.getByLabelText(/Integration test name/)).setAttribute('value', 'new value');
  });
});
