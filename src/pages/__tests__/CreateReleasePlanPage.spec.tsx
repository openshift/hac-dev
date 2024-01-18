import * as React from 'react';
import '@testing-library/jest-dom';
import { configure, screen } from '@testing-library/react';
import { useAccessReviewForModels } from '../../utils/rbac';
import { namespaceRenderer } from '../../utils/test-utils';
import CreateReleasePlanPage from '../CreateReleasePlanPage';

configure({ testIdAttribute: 'data-test' });

jest.mock('react-router-dom', () => ({
  ...(jest as any).requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('../../utils/rbac', () => ({
  useAccessReviewForModels: jest.fn(),
}));

const accessReviewMock = useAccessReviewForModels as jest.Mock;

describe('CreateReleasePlanPage', () => {
  it('should show the spinner when access check is not loaded', () => {
    namespaceRenderer(<CreateReleasePlanPage />, 'test-ns', {
      workspace: 'test-ws',
    });
    expect(screen.getByRole('progressbar')).toBeVisible();
  });

  it('should render no access state', () => {
    accessReviewMock.mockReturnValue([false, true]);
    namespaceRenderer(<CreateReleasePlanPage />, 'test-ns', {
      workspace: 'test-ws',
      workspacesLoaded: true,
    });
    expect(screen.getByTestId('no-access-state')).toBeVisible();
  });
});
