import * as React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import { formikRenderer } from '../../../../utils/test-utils';
import { UsernameSection } from '../UsernameSection';

describe('UsernameSection', () => {
  it('should show usernames field', () => {
    formikRenderer(<UsernameSection />, { usernames: [] });
    expect(screen.getByText('Add users')).toBeVisible();
    expect(screen.getByText('Enter usernames')).toBeVisible();
    expect(screen.getByRole('searchbox')).toBeVisible();
  });

  it('should add username chip when entered', () => {
    formikRenderer(<UsernameSection />, { usernames: [] });
    fireEvent.input(screen.getByRole('searchbox'), { target: { value: 'user1' } });
    fireEvent.blur(screen.getByRole('searchbox'));
    expect(screen.getByRole('list', { name: 'Chip group category' })).toBeVisible();
    expect(screen.getByText('user1')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Remove user1' }));
    expect(screen.queryByText('user1')).not.toBeInTheDocument();
    fireEvent.input(screen.getByRole('searchbox'), { target: { value: 'user2' } });
    fireEvent.blur(screen.getByRole('searchbox'));
    expect(screen.getByText('user2')).toBeVisible();
  });
});
