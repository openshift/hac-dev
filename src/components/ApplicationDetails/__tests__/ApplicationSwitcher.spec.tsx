import * as React from 'react';
import { act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useApplications } from '../../../hooks/useApplications';
import { useAccessReviewForModel } from '../../../utils/rbac';
import { routerRenderer } from '../../../utils/test-utils';
import { mockApplication } from '../__data__/mock-data';
import { ApplicationSwitcher } from '../ApplicationSwitcher';

jest.mock('../../../hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn(() => [{}, jest.fn()]),
}));

jest.mock('../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ workspace: 'test-ws' })),
}));

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));
const useAccessReviewForModelMock = useAccessReviewForModel as jest.Mock;

const navigateMock = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

jest.mock('../../../hooks/useApplications', () => ({
  useApplications: jest.fn(),
}));
const useApplicationsMock = useApplications as jest.Mock;

const app1 = {
  ...mockApplication,
  metadata: { ...mockApplication.metadata, name: 'test-app-1', uuid: '1' },
  spec: { ...mockApplication.spec, displayName: 'Test Application 1' },
};
const app2 = {
  ...mockApplication,
  metadata: { ...mockApplication.metadata, name: 'test-app-2', uuid: '2' },
  spec: { ...mockApplication.spec, displayName: 'Test Application 2' },
};
const app3 = {
  ...mockApplication,
  metadata: { ...mockApplication.metadata, name: 'test-app-3', uuid: '3' },
  spec: { ...mockApplication.spec, displayName: 'Test Application 3' },
};

describe('ContextSwitcher', () => {
  beforeEach(() => {
    useApplicationsMock.mockReturnValue([[app1, app2, app3], true]);
    useAccessReviewForModelMock.mockReturnValue([true, true]);
  });

  it('should render application switcher component', () => {
    const switcher = routerRenderer(<ApplicationSwitcher selectedApplication="test-app-1" />);
    act(() => screen.getByRole('button').click());

    expect(screen.getByPlaceholderText('Filter application by name')).toBeVisible();
    expect(screen.getByText('Recent')).toBeVisible();
    expect(screen.getByText('All')).toBeVisible();
    expect(screen.queryByText('Create application')).toHaveAttribute('aria-disabled', 'false');
    switcher.unmount();
  });

  it('should inform user when there is no access', () => {
    useAccessReviewForModelMock.mockReturnValue([false, true]);
    const switcher = routerRenderer(<ApplicationSwitcher selectedApplication="test-app-1" />);
    act(() => screen.getByRole('button').click());

    expect(screen.getByPlaceholderText('Filter application by name')).toBeVisible();
    expect(screen.getByText('Recent')).toBeVisible();
    expect(screen.getByText('All')).toBeVisible();
    expect(screen.queryByText('Create application')).toHaveAttribute('aria-disabled', 'true');
    switcher.unmount();
  });

  it('should show currently selected item', () => {
    const switcher = routerRenderer(<ApplicationSwitcher selectedApplication="test-app-1" />);
    act(() => screen.getByRole('button').click());

    const selectedItem = screen.queryAllByRole('menuitem')[0];
    expect(selectedItem).toBeVisible();
    expect(selectedItem).toHaveClass('pf-m-selected');
    switcher.unmount();
  });

  it('should navigate to the selected application', () => {
    const switcher = routerRenderer(<ApplicationSwitcher selectedApplication="test-app-1" />);
    act(() => screen.getByRole('button').click());

    expect(screen.getByText('Test Application 2')).toBeVisible();
    act(() => screen.getByText('Test Application 2').click());
    expect(navigateMock).toHaveBeenCalledWith(
      '/application-pipeline/workspaces/test-ws/applications/test-app-2',
    );
    expect(screen.queryByText('Test Application 2')).toBeNull();
    switcher.unmount();
  });
});
