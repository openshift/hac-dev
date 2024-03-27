import React from 'react';
import { render, screen } from '@testing-library/react';
import { usePipelineRuns } from '../../../../hooks/usePipelineRuns';
import { mockTestPipelinesData } from '../../../ApplicationDetails/__data__';
import IntegrationTestPipelineRunTab from '../IntegrationTestPipelineRunTab';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../../hooks/usePipelineRuns', () => ({
  usePipelineRuns: jest.fn(),
}));

const usePipelineRunsMock = usePipelineRuns as jest.Mock;

describe('Integration Pipelinerun List', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the progressbar if it is still loading', () => {
    usePipelineRunsMock.mockReturnValue([[], false]);
    render(
      <IntegrationTestPipelineRunTab
        applicationName={'test-app'}
        testName="integration-test-one"
      />,
    );
    screen.getByRole('progressbar');
  });

  it('should render the error state incase of any API errors', () => {
    usePipelineRunsMock.mockReturnValue([[], false, new Error('500: Internal server error')]);
    render(
      <IntegrationTestPipelineRunTab
        applicationName={'test-app'}
        testName="integration-test-one"
      />,
    );
    screen.getByText('Unable to load pipeline runs');
  });

  it('should render the empty state if there is not any pipelineruns available', () => {
    usePipelineRunsMock.mockReturnValue([[], true]);
    render(
      <IntegrationTestPipelineRunTab
        applicationName={'test-app'}
        testName="integration-test-one"
      />,
    );
    screen.getByText('Add component');
  });

  it('should render the pipelineruns list', () => {
    usePipelineRunsMock.mockReturnValue([mockTestPipelinesData, true]);
    render(
      <IntegrationTestPipelineRunTab
        applicationName={'test-app'}
        testName="integration-test-one"
      />,
    );
    screen.getByLabelText('Pipeline run List');
  });
});
