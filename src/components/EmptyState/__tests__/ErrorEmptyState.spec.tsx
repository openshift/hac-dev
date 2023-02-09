import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyStateBody, Title } from '@patternfly/react-core';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { HttpError } from '../../../shared/utils/error/http-error';
import ErrorEmptyState from '../ErrorEmptyState';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

const useNavigateMock = useNavigate as jest.Mock;

describe('ErrorEmptyState', () => {
  let navigateMock;

  beforeEach(() => {
    navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should show 404 page on a 404 error', async () => {
    render(
      <ErrorEmptyState httpError={HttpError.fromCode(404)} title="test title" body="test body" />,
    );
    screen.getByText('404: Page not found');
    expect(screen.queryByText('test title')).toBeNull();
    expect(screen.queryByText('test body')).toBeNull();

    const appsButton = screen.getByText('Go to applications list');
    await act(async () => {
      fireEvent.click(appsButton);
    });
    expect(navigateMock).toHaveBeenCalledWith('/stonesoup/workspaces');
  });

  it('Should show title and body on non-404 errors', async () => {
    render(
      <ErrorEmptyState httpError={HttpError.fromCode(403)} title="test title" body="test body" />,
    );
    screen.getByText('test title');
    screen.getByText('test body');

    expect(screen.queryByText('Go to applications list')).toBeNull();
  });

  it('Should allow custom errors', async () => {
    render(
      <ErrorEmptyState>
        <Title headingLevel="h4" size="lg">
          custom title
        </Title>
        <EmptyStateBody>custom body</EmptyStateBody>
      </ErrorEmptyState>,
    );
    screen.getByText('custom title');
    screen.getByText('custom body');

    expect(screen.queryByText('Go to applications list')).toBeNull();
  });
});
