import * as React from 'react';
import { act, render, screen, configure } from '@testing-library/react';
import { useApplicationsInfo } from '../../hooks/useApplicationsInfo';
import AppFlow from '../AppFlow';

configure({ testIdAttribute: 'data-test' });

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('../../hooks/useApplicationsInfo', () => ({
  useApplicationsInfo: jest.fn(),
}));

jest.mock('../ApplicationListView/ApplicationList', () => () => (
  <div data-test="app-list-view">Application List</div>
));

describe('AppFlow', () => {
  const mockUseApplicationInfo = useApplicationsInfo as jest.Mock;

  it('Should show loading while application list is loading', () => {
    mockUseApplicationInfo.mockReturnValue({ loaded: false, appExists: false });
    act(() => {
      render(<AppFlow />);
    });
    screen.getByTestId('loading-indicator');
    expect(mockHistoryPush).toHaveBeenCalledTimes(0);
  });

  it('Should show application list view if applications exist', () => {
    mockUseApplicationInfo.mockReturnValue({ loaded: true, appExists: true });
    act(() => {
      render(<AppFlow />);
    });
    screen.getByTestId('app-list-view');
    expect(mockHistoryPush).toHaveBeenCalledTimes(0);
  });

  it('Should show application creation view if applications do not exist', () => {
    mockUseApplicationInfo.mockReturnValue({ loaded: true, appExists: false });
    act(() => {
      render(<AppFlow />);
    });
    expect(mockHistoryPush).toHaveBeenCalledWith('/app-studio/create');
  });
});
