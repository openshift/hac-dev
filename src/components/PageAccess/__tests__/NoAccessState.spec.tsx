import * as React from 'react';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '@patternfly/react-core';
import { configure, fireEvent, render, screen, waitFor } from '@testing-library/react';
import NoAccessState from '../NoAccessState';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModels: jest.fn(),
}));

configure({ testIdAttribute: 'data-test' });

const useNavigateMock = useNavigate as jest.Mock;

describe('NoAccessState', () => {
  let navigateMock;

  beforeEach(() => {
    navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
  });

  it('should render default values when no props are passed', () => {
    render(<NoAccessState />);

    screen.getByTestId('no-access-state');
    screen.getByText('Access permissions needed');
    screen.getByText('To access this page, ask your administrator to adjust your permissions.');
    screen.getByText('Go to applications list');
  });

  it('should navigate to the applications list page', async () => {
    render(<NoAccessState />);
    fireEvent.click(screen.queryByTestId('no-access-action'));
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/stonesoup/workspaces');
    });
  });

  it('should render custom title, body, and button', () => {
    render(
      <NoAccessState title="Test title" body="Test body">
        <Button>Test Button</Button>
      </NoAccessState>,
    );

    screen.getByTestId('no-access-state');
    screen.getByText('Test title');
    screen.getByText('Test body');
    screen.getByText('Test Button');
  });
});
