import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import AppFlow from '../AppFlow';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('../../hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn(),
}));

jest.mock('../SamplesFlow', () => () => <div data-testid="create-app">Create Application</div>);

const localStorageMock = useLocalStorage as jest.Mock;

describe('AppFlow', () => {
  it('should render create application if first time login', () => {
    localStorageMock.mockReturnValue([
      {
        firstLogin: true,
        lastViewedApp: '',
      },
      (data) => data,
    ]);
    act(() => {
      render(<AppFlow />);
    });
    const sampleFlowComp = screen.getByText('Create Application');
    expect(sampleFlowComp).toBeInTheDocument();
  });

  it('should update location for last viewed application if next login and have application', () => {
    localStorageMock.mockReturnValue([
      {
        firstLogin: false,
        lastViewedApp: 'test-app',
      },
      (data) => data,
    ]);
    act(() => {
      render(<AppFlow />);
    });
    expect(mockHistoryPush).toHaveBeenCalledWith('/components?application=test-app');
  });

  it('should update location for create application if next login and there is no application', () => {
    localStorageMock.mockReturnValue([
      {
        firstLogin: false,
        lastViewedApp: '',
      },
      (data) => data,
    ]);
    act(() => {
      render(<AppFlow />);
    });
    expect(mockHistoryPush).toHaveBeenCalledWith('/create-application');
  });
});
