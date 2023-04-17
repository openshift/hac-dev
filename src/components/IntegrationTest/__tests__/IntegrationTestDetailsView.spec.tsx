import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, screen } from '@testing-library/react';
import { WatchK8sResource } from '../../../dynamic-plugin-sdk';
import {
  IntegrationTestScenarioGroupVersionKind,
  PipelineRunGroupVersionKind,
} from '../../../models';
import { IntegrationTestScenarioKind } from '../../../types/coreBuildService';
import { routerRenderer } from '../../../utils/test-utils';
import { mockPipelineRuns } from '../../ApplicationDetails/__data__/mock-pipeline-run';
import IntegrationTestDetailsView from '../IntegrationTestDetailsView';
import { MockIntegrationTestsWithGit } from '../IntegrationTestsListView/__data__/mock-integration-tests';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props) => <a href={props.to}>{props.children}</a>,
    useNavigate: () => {},
    useSearchParams: () => React.useState(() => new URLSearchParams()),
  };
});

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;

configure({ testIdAttribute: 'data-test' });

const mockIntegrationTests: IntegrationTestScenarioKind[] = [...MockIntegrationTestsWithGit];

const getMockedResources = (params: WatchK8sResource) => {
  if (params.groupVersionKind === IntegrationTestScenarioGroupVersionKind) {
    return [
      mockIntegrationTests.find((t) => !params.name || t.metadata.name === params.name),
      true,
    ];
  }
  if (params.groupVersionKind === PipelineRunGroupVersionKind) {
    return [[mockPipelineRuns], true];
  }
  return [[], true];
};

describe('IntegrationTestDetailsView', () => {
  it('should render spinner if test data is not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    routerRenderer(<IntegrationTestDetailsView testName="int-test" applicationName="test-app" />);
    screen.getByRole('progressbar');
  });

  it('should show error state if test cannot be loaded', () => {
    watchResourceMock.mockReturnValue([
      [],
      false,
      { message: 'Application does not exist', code: 404 },
    ]);
    routerRenderer(<IntegrationTestDetailsView testName="int-test" applicationName="test-app" />);
    screen.getByText('404: Page not found');
  });

  it('should display test data when loaded', () => {
    watchResourceMock.mockImplementation(getMockedResources);
    routerRenderer(
      <IntegrationTestDetailsView testName="test-app-test-1" applicationName="test-app" />,
    );
    expect(screen.getByTestId('test-name').innerHTML).toBe('test-app-test-1');
  });

  it('should show error state if test is being deleted', () => {
    mockIntegrationTests[0].metadata.deletionTimestamp = '1';
    watchResourceMock.mockImplementation(getMockedResources);
    routerRenderer(
      <IntegrationTestDetailsView testName="test-app-test-1" applicationName="test-app" />,
    );
    screen.getByText('404: Page not found');
  });
});
