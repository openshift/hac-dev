import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { UserSignupStatus } from '../../../hooks/useSignupStatus';
import SignupView from '../SignupView';

describe('Signup View', () => {
  it('should show Signup Form when status is NotSignedup', () => {
    render(<SignupView status={UserSignupStatus.NOT_SIGNEDUP} onStatusChange={() => {}} />);
    screen.getByRole('button', { name: 'Sign up for App Studio access' });
  });

  it('should show alert when status is PendingApproval', () => {
    render(<SignupView status={UserSignupStatus.PENDING_APPROVAL} onStatusChange={() => {}} />);
    screen.getByRole('heading', {
      name: 'Info alert: We have received your request. We are working hard to get you early access to the App Studio services.',
    });
  });
});
