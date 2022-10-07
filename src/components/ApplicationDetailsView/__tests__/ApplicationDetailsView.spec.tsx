import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, fireEvent, render, screen } from '@testing-library/react';
import { WatchK8sResource } from '../../../dynamic-plugin-sdk';
import { useSearchParam } from '../../../hooks/useSearchParam';
import { ApplicationGroupVersionKind, EnvironmentGroupVersionKind } from '../../../models';
import { GitOpsDeploymentGroupVersionKind } from '../../../models/gitops-deployment';
import {
  mockEnvironment,
  mockGitOpsDeployments,
} from '../../ApplicationEnvironment/__data__/mock-data';
import { mockApplication } from '../__data__/mock-data';
import { mockPipelineRuns } from '../__data__/mock-pipeline-run';
import ApplicationDetailsView from '../ApplicationDetailsView';

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
  useChrome: () => ({
    helpTopics: { setActiveTopic: jest.fn(), enableTopics: jest.fn(), disableTopics: jest.fn() },
  }),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useNavigate: () => {},
}));

jest.mock('../../modal/ModalProvider', () => ({
  useModalLauncher: () => {},
}));

jest.mock('../../../hooks/usePipelineRunsForApplication', () => ({
  useLatestPipelineRunsForApplication: () => [mockPipelineRuns, true, undefined],
  useLatestPipelineRunForComponent: () => mockPipelineRuns[0],
}));

jest.mock('../../../hooks/useSearchParam', () => ({
  useSearchParam: jest.fn(),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;
const useSearchParamMock = useSearchParam as jest.Mock;

const getMockedResources = (params: WatchK8sResource) => {
  if (params.groupVersionKind === ApplicationGroupVersionKind) {
    return [mockApplication, true];
  }
  if (params.groupVersionKind === EnvironmentGroupVersionKind) {
    if (params.isList) {
      return [[mockEnvironment], true];
    }
    return [mockEnvironment, true];
  }
  if (params.groupVersionKind === GitOpsDeploymentGroupVersionKind) {
    return [mockGitOpsDeployments, true];
  }
  return [[], true];
};

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

configure({ testIdAttribute: 'data-test' });

describe('ApplicationDetailsView', () => {
  beforeEach(() => {
    useSearchParamMock.mockImplementation(mockUseSearchParam);
    watchResourceMock.mockImplementation(getMockedResources);
  });

  it('should render spinner if application data is not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    render(<ApplicationDetailsView applicationName="test" />);
    screen.getByRole('progressbar');
  });

  it('should render application display name if application data is loaded', () => {
    render(<ApplicationDetailsView applicationName="test-application" />);
    screen.getAllByText('Test Application');
  });

  it('should show error state if application cannot be loaded', () => {
    watchResourceMock.mockReturnValue([[], false, { message: 'Application does not exist' }]);
    render(<ApplicationDetailsView applicationName="test" />);
    screen.getByText('Application does not exist');
  });

  it('should show the application environment view when a card is clicked', () => {
    const view1 = render(<ApplicationDetailsView applicationName="test" />);
    const envCard = view1.getByTestId(`env-card-${mockEnvironment.metadata.name}`);
    expect(envCard).toBeVisible();
    fireEvent.click(envCard);
    expect(params.environment).toBe(mockEnvironment.metadata.name);
    view1.unmount();

    const view2 = render(<ApplicationDetailsView applicationName="application-to-test" />);
    view2.getByText(`${mockEnvironment.spec.displayName} Deployment Details`);
    const componentDetails = view2.queryByText('Component Details');
    expect(componentDetails).toBeFalsy();

    const componentCard = view2.getByTestId('app-details-component-card');
    expect(componentCard).toBeVisible();
    fireEvent.click(componentCard);
    expect(params.environment).toBeFalsy();
    view2.unmount();

    const view3 = render(<ApplicationDetailsView applicationName="application-to-test" />);
    view3.getByText(`Component Details`);
  });

  it('should hide card details when collapse is clicked', async () => {
    render(<ApplicationDetailsView applicationName="application-to-test" />);
    const envCard = screen.getByTestId(`env-card-${mockEnvironment.metadata.name}`);
    expect(envCard).toBeVisible();
    let label = screen.queryByText('Automated');
    expect(label).toBeVisible();
    const collapse = screen.getByTestId('app-details-card-collapse');
    fireEvent.click(collapse);
    label = screen.queryByText('Automated');
    expect(label).toBeFalsy();
  });
});
