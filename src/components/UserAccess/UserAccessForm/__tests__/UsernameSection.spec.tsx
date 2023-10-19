import * as React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { formikRenderer } from '../../../../utils/test-utils';
import { validateUsername } from '../form-utils';
import { UsernameSection } from '../UsernameSection';

jest.mock('../form-utils', () => ({
  validateUsername: jest.fn(),
}));

const validateMock = validateUsername as jest.Mock;

describe('UsernameSection', () => {
  it('should show usernames field', () => {
    formikRenderer(<UsernameSection />, { usernames: [] });
    expect(screen.getByText('Add users')).toBeVisible();
    expect(screen.getByText('Enter usernames')).toBeVisible();
    expect(screen.getByRole('searchbox')).toBeVisible();
  });

  it('should add username chip when entered', async () => {
    validateMock.mockResolvedValue(true);
    formikRenderer(<UsernameSection />, { usernames: [] });
    await act(async () => {
      fireEvent.input(screen.getByRole('searchbox'), { target: { value: 'user1' } });
    });
    await waitFor(() =>
      expect(screen.getByRole('list', { name: 'Chip group category' })).toBeVisible(),
    );
    expect(screen.getByText('user1')).toBeVisible();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Remove user1' }));
    });
    expect(screen.queryByText('user1')).not.toBeInTheDocument();

    validateMock.mockResolvedValue(true);
    await act(async () => {
      fireEvent.input(screen.getByRole('searchbox'), { target: { value: 'user2' } });
    });
    await waitFor(() => expect(screen.getByText('user2')).toBeVisible());
    expect(screen.getByText('user2')).toBeVisible();
  });

  it('should show correct field status while entering', async () => {
    validateMock.mockResolvedValue(false);
    formikRenderer(<UsernameSection />, { usernames: [] });
    expect(
      screen.getByText('Provide RHTAP usernames for the users you want to invite.'),
    ).toBeVisible();
    await act(async () => {
      fireEvent.input(screen.getByRole('searchbox'), { target: { value: 'user!@#' } });
    });
    await waitFor(() => expect(screen.getByText('Invalid username format.')).toBeVisible());

    await act(async () => {
      fireEvent.input(screen.getByRole('searchbox'), { target: { value: 'user' } });
    });
    await waitFor(() => expect(screen.getByText('Validating...')).toBeVisible());
    await waitFor(() => expect(screen.getByText('Username not found.')).toBeVisible());

    validateMock.mockResolvedValue(true);
    await act(async () => {
      fireEvent.input(screen.getByRole('searchbox'), { target: { value: 'user1' } });
    });
    await waitFor(() => expect(screen.getByText('Validating...')).toBeVisible());
    await waitFor(() => expect(screen.getByText('Validated')).toBeVisible());
    await waitFor(() =>
      expect(screen.getByRole('list', { name: 'Chip group category' })).toBeVisible(),
    );
    expect(screen.getByText('user1')).toBeVisible();
  });

  it('should not add username again if entry already exists', async () => {
    validateMock.mockResolvedValue(true);
    formikRenderer(<UsernameSection />, { usernames: [] });
    await act(async () => {
      fireEvent.input(screen.getByRole('searchbox'), { target: { value: 'user1' } });
    });
    await waitFor(() =>
      expect(screen.getByRole('list', { name: 'Chip group category' })).toBeVisible(),
    );
    expect(screen.getByText('user1')).toBeVisible();

    await act(async () => {
      fireEvent.input(screen.getByRole('searchbox'), { target: { value: 'user1' } });
    });
    expect(screen.getAllByText('user1')).toHaveLength(1);
  });
});
