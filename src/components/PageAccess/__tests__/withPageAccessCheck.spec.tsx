import * as React from 'react';
import { screen } from '@testing-library/react';
import { useAccessReviewForModels } from '../../../utils/rbac';
import { routerRenderer } from '../../../utils/test-utils';
import { withPageAccessCheck } from '../withPageAccessCheck';

jest.mock('../../../utils/rbac', () => {
  const actual = jest.requireActual('../../../utils/rbac');
  return {
    ...actual,
    useAccessReviewForModels: jest.fn(),
  };
});

const mockAccessReviewForModels = useAccessReviewForModels as jest.Mock;

const DummyComponent: React.FC<React.PropsWithChildren<unknown>> = () => <>child component</>;

describe('withPageAccessCheck', () => {
  it('should render passed component', () => {
    mockAccessReviewForModels.mockReturnValue([true, true]);
    const Component = withPageAccessCheck(DummyComponent)({ accessReviewResources: [] });
    routerRenderer(<Component />);
    screen.getByText('child component');
  });

  it('should render empty state when access is invalid', () => {
    mockAccessReviewForModels.mockReturnValue([false, true]);
    const Component = withPageAccessCheck(DummyComponent)({
      accessReviewResources: [],
      accessDeniedTitle: 'access denied',
    });
    routerRenderer(<Component />);
    screen.getByText('access denied');
  });
});
