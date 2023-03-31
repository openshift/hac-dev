import * as React from 'react';
import { useParams } from 'react-router-dom';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, screen } from '@testing-library/react';
import { useAccessReviewForModels } from '../../utils/rbac';
import { namespaceRenderer } from '../../utils/test-utils';
import PipelineRunPage from '../PipelineRunPage';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: jest.fn(),
  };
});

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../utils/rbac', () => ({
  useAccessReviewForModels: jest.fn(),
}));

jest.mock('../../components/PipelineRunDetailsView/PipelineRunDetailsView', () => ({
  PipelineRunDetailsView: () => {
    return <div data-test="pipelinerun-details-page" />;
  },
}));

jest.mock('../../components/PipelineRunListView/PipelineRunsListView', () => () => (
  <div data-test="pipelinerun-list-page" />
));

const accessReviewMock = useAccessReviewForModels as jest.Mock;
const watchResourceMock = useK8sWatchResource as jest.Mock;
const useParamsMock = useParams as jest.Mock;

configure({ testIdAttribute: 'data-test' });

describe('PipelineRunPage', () => {
  beforeEach(() => {
    useParamsMock.mockReturnValue({ plrName: 'my-pipelinerun' });
    accessReviewMock.mockReturnValue([true, true]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show the spinner when access check is not loaded', () => {
    accessReviewMock.mockReturnValue([true, false]);
    watchResourceMock.mockReturnValue([[], true, null]);
    namespaceRenderer(<PipelineRunPage />, 'test-ns', { workspacesLoaded: true });

    screen.getByTestId('spinner');
  });

  it('should render pipelinerun details page', () => {
    accessReviewMock.mockReturnValue([true, true]);
    watchResourceMock.mockReturnValue([[], true, null]);
    namespaceRenderer(<PipelineRunPage />, 'test-ns', { workspacesLoaded: true });

    screen.getByTestId('pipelinerun-details-page');
  });

  it('should render pipelinerun list page', () => {
    useParamsMock.mockReturnValue({ plrName: '' });
    accessReviewMock.mockReturnValue([true, true]);
    watchResourceMock.mockReturnValue([[], true, null]);
    namespaceRenderer(<PipelineRunPage />, 'test-ns', { workspacesLoaded: true });

    screen.getByTestId('pipelinerun-list-page');
  });
});
