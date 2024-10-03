import * as React from 'react';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useApplications } from '../../../hooks/useApplications';
import AddSecretForm from '../SecretsForm/AddSecretForm';

jest.mock('../../../hooks/useApplications', () => ({
  useApplications: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../utils/secret-utils', () => {
  const actual = jest.requireActual('../utils/secret-utils');
  return {
    ...actual,
    getAddSecretBreadcrumbs: jest.fn(undefined),
  };
});

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({
    helpTopics: { setActiveTopic: jest.fn(), enableTopics: jest.fn(), disableTopics: jest.fn() },
  }),
}));

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

jest.mock('../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

const useApplicationsMock = useApplications as jest.Mock;
const useNavigateMock = useNavigate as jest.Mock;
window.ResizeObserver = MockResizeObserver;

describe('AddSecretForm', () => {
  let navigateMock;

  beforeEach(() => {
    navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
    useApplicationsMock.mockReturnValue([[], true]);
  });

  it('should render the add secret form', async () => {
    useApplicationsMock.mockReturnValue([[], false]);

    render(<AddSecretForm />);

    await waitFor(() => {
      screen.getByText('Secret type');
      screen.getByText('Select or enter secret name');
      screen.getByText('Labels');
    });
  });

  it('should navigate back when cancel button is clicked', async () => {
    useApplicationsMock.mockReturnValue([[], false]);
    render(<AddSecretForm />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    });
    await waitFor(() => {
      expect(useNavigateMock).toHaveBeenCalled();
    });
  });
});
