import * as React from 'react';
import { configure, fireEvent, render, RenderResult, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useApplications } from '../../../../hooks/useApplications';
import { namespaceRenderer } from '../../../../utils/test-utils';
import { WorkspaceContext } from '../../../../utils/workspace-context-utils';
import { mockApplication } from '../../../ApplicationDetails/__data__/mock-data';
import { MockIntegrationTests } from '../../IntegrationTestsListView/__data__/mock-integration-tests';
import IntegrationTestView from '../IntegrationTestView';
import { createIntegrationTest } from '../utils/create-utils';

const navigateMock = jest.fn();

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useNavigate: () => navigateMock,
  useParams: jest.fn(() => ({
    appName: 'test-app',
  })),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('../utils/create-utils.ts', () => ({
  createIntegrationTest: jest.fn(),
}));

jest.mock('../../../../hooks/useApplications', () => ({
  useApplications: jest.fn(),
}));

jest.mock('../../../../utils/workspace-context-utils', () => {
  const actual = jest.requireActual('../../../../utils/workspace-context-utils');
  return {
    ...actual,
    useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
  };
});
const createIntegrationTestMock = createIntegrationTest as jest.Mock;

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
      setWorkspace: () => {},
      workspace: 'test-ws',
      workspacesLoaded: true,
      workspaces: [],
    }}
  >
    {children}
  </WorkspaceContext.Provider>
);

const useApplicationsMock = useApplications as jest.Mock;

describe('IntegrationTestView', () => {
  beforeEach(() => {
    useApplicationsMock.mockReturnValue([[mockApplication], true]);
  });
  const fillIntegrationTestForm = (wrapper: RenderResult) => {
    fireEvent.input(wrapper.getByLabelText(/Integration test name/), {
      target: { value: 'new-test-name' },
    });
    fireEvent.input(wrapper.getByLabelText(/Image bundle/), {
      target: { value: 'quay.io/kpavic/test-bundle:pipeline' },
    });
    fireEvent.input(wrapper.getByLabelText(/Pipeline to run/), {
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
    wrapper.getByLabelText(/Image bundle/);
    wrapper.getByLabelText(/Pipeline to run/);
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
    createIntegrationTestMock.mockImplementation(() => {
      return new Promise<void>((resolve) => {
        resolve();
      });
    });
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
        '/stonesoup/workspaces/test-ws/applications/test-app/integrationtests',
      ),
    );
  });

  it('should init values from provided integration test', async () => {
    const integrationTest = MockIntegrationTests[0];
    const wrapper = render(
      <IntegrationTestViewWrapper>
        <IntegrationTestView applicationName="test-app" integrationTest={integrationTest} />,
      </IntegrationTestViewWrapper>,
    );

    expect((await wrapper.getByLabelText(/Integration test name/)).getAttribute('value')).toBe(
      integrationTest.metadata.name,
    );
    expect((await wrapper.getByLabelText(/Image bundle/)).getAttribute('value')).toBe(
      integrationTest.spec.bundle,
    );
    expect((await wrapper.getByLabelText(/Pipeline to run/)).getAttribute('value')).toBe(
      integrationTest.spec.pipeline,
    );
  });

  it('should be in edit mode', async () => {
    const integrationTest = MockIntegrationTests[0];
    const wrapper = render(
      <IntegrationTestViewWrapper>
        <IntegrationTestView applicationName="test-app" integrationTest={integrationTest} />
      </IntegrationTestViewWrapper>,
    );

    expect(((await wrapper.getByText(/Save changes/)) as HTMLButtonElement).disabled).toBe(true);
    (await wrapper.getByLabelText(/Integration test name/)).setAttribute('value', 'new value');
  });
});
