import * as React from 'react';
import { useParams } from 'react-router-dom';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, screen } from '@testing-library/react';
import { useAccessReviewForModels } from '../../utils/rbac';
import { namespaceRenderer } from '../../utils/test-utils';
import TriggerReleasePlanPage from '../TriggerReleasePlanPage';

configure({ testIdAttribute: 'data-test' });

jest.mock('react-router-dom', () => ({
  ...(jest as any).requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('../../utils/rbac', () => ({
  useAccessReviewForModels: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

const accessReviewMock = useAccessReviewForModels as jest.Mock;

const watchResourceMock = useK8sWatchResource as jest.Mock;
const useParamsMock = useParams as jest.Mock;

describe('EditReleasePlanPage', () => {
  beforeEach(() => {
    useParamsMock.mockReturnValue({ name: 'my-release-plan' });
    accessReviewMock.mockReturnValue([true, true]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show the spinner when access check is not loaded', () => {
    accessReviewMock.mockReturnValue([true, false]);
    watchResourceMock.mockReturnValue([{}, false, null]);
    namespaceRenderer(<TriggerReleasePlanPage />, 'test-ns', {
      workspace: 'test-ws',
    });
    expect(screen.getByRole('progressbar')).toBeVisible();
  });

  it('should show the spinner when resource is found but not loaded', () => {
    accessReviewMock.mockReturnValue([true, false]);
    watchResourceMock.mockReturnValue([{}, false, null]);
    namespaceRenderer(<TriggerReleasePlanPage />, 'test-ns', {
      workspace: 'test-ws',
    });
    expect(screen.getByTestId('spinner')).toBeVisible();
  });

  it('should render no access state', () => {
    accessReviewMock.mockReturnValue([false, true]);
    watchResourceMock.mockReturnValue([{}, true]);

    namespaceRenderer(<TriggerReleasePlanPage />, 'test-ns', {
      workspace: 'test-ws',
      workspacesLoaded: true,
    });
    expect(screen.getByTestId('no-access-state')).toBeVisible();
  });

  it('should show error state if no name is specified', () => {
    useParamsMock.mockReturnValue({});
    watchResourceMock.mockReturnValue([
      {},
      false,
      { message: 'ReleasePlan does not exist', code: 404 },
    ]);
    namespaceRenderer(<TriggerReleasePlanPage />, 'test-ns', {
      workspace: 'test-ws',
    });
    expect(screen.getByText('404: Page not found')).toBeVisible();
  });
});
