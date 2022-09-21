import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { WatchK8sResource } from '../../../dynamic-plugin-sdk';
import { useSearchParam } from '../../../hooks/useSearchParam';
import {
  ApplicationGroupVersionKind,
  ComponentGroupVersionKind,
  EnvironmentGroupVersionKind,
} from '../../../models';
import { GitOpsDeploymentGroupVersionKind } from '../../../models/gitops-deployment';
import {
  mockApplication,
  mockComponents,
  mockEnvironment,
  mockGitOpsDeployments,
} from '../__data__/mock-data';
import { ApplicationEnvironmentDetailsView } from '../ApplicationEnvironmentDetailsView';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../../hooks/useQuickstartCloseOnUnmount', () => ({
  useQuickstartCloseOnUnmount: jest.fn(),
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({ helpTopics: { setActiveTopic: jest.fn(), enableTopics: jest.fn() } }),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useNavigate: () => {},
}));

jest.mock('../../modal/ModalProvider', () => ({
  useModalLauncher: () => {},
}));

jest.mock('../../../hooks/useSearchParam', () => ({
  useSearchParam: jest.fn(),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;
const useSearchParamMock = useSearchParam as jest.Mock;

const getMockedResources = (kind: WatchK8sResource) => {
  if (kind.groupVersionKind === ApplicationGroupVersionKind) {
    return [mockApplication, true];
  }
  if (kind.groupVersionKind === EnvironmentGroupVersionKind) {
    return [mockEnvironment, true];
  }
  if (kind.groupVersionKind === ComponentGroupVersionKind) {
    return [mockComponents, true];
  }
  if (kind.groupVersionKind === GitOpsDeploymentGroupVersionKind) {
    return [mockGitOpsDeployments, true];
  }
  return [[], true];
};
const getMockedEmptyComponents = (kind: WatchK8sResource) => {
  if (kind.groupVersionKind === ApplicationGroupVersionKind) {
    return [mockApplication, true];
  }
  if (kind.groupVersionKind === EnvironmentGroupVersionKind) {
    return [mockEnvironment, true];
  }
  if (kind.groupVersionKind === GitOpsDeploymentGroupVersionKind) {
    return [mockGitOpsDeployments, true];
  }
  return [[], true];
};
const getMockedLoadingComponents = (kind: WatchK8sResource) => {
  if (kind.groupVersionKind === ApplicationGroupVersionKind) {
    return [mockApplication, true];
  }
  if (kind.groupVersionKind === EnvironmentGroupVersionKind) {
    return [mockEnvironment, true];
  }
  if (kind.groupVersionKind === GitOpsDeploymentGroupVersionKind) {
    return [mockGitOpsDeployments, true];
  }
  if (kind.groupVersionKind === ComponentGroupVersionKind) {
    return [[], false];
  }
  return [[], true];
};

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

let params = {};

const mockUseSearchParam = (name: string) => {
  const setter = (value) => {
    params[name] = value;
  };
  const unset = () => {
    params[name] = '';
  };
  return [params[name], setter, unset];
};

describe('ApplicationEnvironmentDetailsView', () => {
  beforeEach(() => {
    params = {};
  });

  it('should render spinner if data is not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    useSearchParamMock.mockImplementation(mockUseSearchParam);
    render(
      <ApplicationEnvironmentDetailsView
        environmentName="production"
        applicationName="test-application"
      />,
    );
    screen.getByRole('progressbar');
  });

  it('should render the empty state if there are no components', () => {
    watchResourceMock.mockImplementation(getMockedEmptyComponents);
    useSearchParamMock.mockImplementation(mockUseSearchParam);
    render(
      <ApplicationEnvironmentDetailsView
        environmentName="production"
        applicationName="test-application"
      />,
    );
    screen.getByTestId('env-details-empty-state');
  });

  it('should render spinner if components are not loaded', () => {
    watchResourceMock.mockImplementation(getMockedLoadingComponents);
    useSearchParamMock.mockImplementation(mockUseSearchParam);
    render(
      <ApplicationEnvironmentDetailsView
        environmentName="production"
        applicationName="test-application"
      />,
    );
    screen.getByRole('progressbar');
  });

  it('should render environment display name if environment data is loaded', () => {
    watchResourceMock.mockImplementation(getMockedResources);
    useSearchParamMock.mockImplementation(mockUseSearchParam);
    render(
      <ApplicationEnvironmentDetailsView
        environmentName="production"
        applicationName="test-application"
      />,
    );
    screen.getAllByText(`production Deployment Details`);
  });

  it('should render a list view of components by default', async () => {
    watchResourceMock.mockImplementation(getMockedResources);
    useSearchParamMock.mockImplementation(mockUseSearchParam);
    render(
      <ApplicationEnvironmentDetailsView
        environmentName="production"
        applicationName="test-application"
      />,
    );
    await waitFor(() => {
      // const componentList = screen.getByTestId('application-environment-list');
      const componentListItems = screen.getAllByTestId('application-environment-list-item');
      expect(componentListItems.length).toBe(mockComponents.length);
    });
  });

  it('should render a graph view when the user changes views', async () => {
    watchResourceMock.mockImplementation(getMockedResources);
    useSearchParamMock.mockImplementation(mockUseSearchParam);

    render(
      <ApplicationEnvironmentDetailsView
        environmentName="production"
        applicationName="test-application"
      />,
    );
    const graphToggle = await within(screen.getByTestId('graph-view-toggle')).findByRole('button');
    expect(graphToggle).toBeTruthy();
    fireEvent.click(graphToggle);

    const updated = render(
      <ApplicationEnvironmentDetailsView
        environmentName="production"
        applicationName="test-application"
      />,
    );

    await waitFor(() => updated.getByTestId('application-environment-graph'));
  });
});
