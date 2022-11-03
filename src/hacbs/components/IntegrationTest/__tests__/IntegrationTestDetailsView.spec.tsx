import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, render, screen } from '@testing-library/react';
import { mockPipelineRuns } from '../../../../components/ApplicationDetailsView/__data__/mock-pipeline-run';
import { WatchK8sResource } from '../../../../dynamic-plugin-sdk';
import { PipelineRunGroupVersionKind } from '../../../../shared';
import { IntegrationTestScenarioGroupVersionKind } from '../../../models';
import { MockIntegrationTests } from '../../IntegrationTestsListView/__data__/mock-integration-tests';
import IntegrationTestDetailsView from '../IntegrationTestDetailsView';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useNavigate: () => {},
  useSearchParams: () => React.useState(() => new URLSearchParams()),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;

configure({ testIdAttribute: 'data-test' });

const getMockedResources = (params: WatchK8sResource) => {
  if (params.groupVersionKind === IntegrationTestScenarioGroupVersionKind) {
    return [MockIntegrationTests[0], true];
  }
  if (params.groupVersionKind === PipelineRunGroupVersionKind) {
    return [[mockPipelineRuns], true];
  }
  return [[], true];
};

describe('IntegrationTestDetailsView', () => {
  it('should render spinner if test data is not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    render(<IntegrationTestDetailsView testName="int-test" applicationName="test" />);
    screen.getByRole('progressbar');
  });

  it('should show error state if test cannot be loaded', () => {
    watchResourceMock.mockReturnValue([[], false, { message: 'Application does not exist' }]);
    render(<IntegrationTestDetailsView testName="int-test" applicationName="test" />);
    screen.getByText('Could not load IntegrationTestScenario');
  });

  it('should display test data when loaded', () => {
    watchResourceMock.mockImplementation(getMockedResources);
    render(<IntegrationTestDetailsView testName="int-test" applicationName="test" />);
    expect(screen.getByTestId('test-name').innerHTML).toBe(MockIntegrationTests[0].metadata.name);
  });
});
