import * as React from 'react';
import { act, render, screen, configure, fireEvent } from '@testing-library/react';
import AppBanner from '../AppBanner';

configure({ testIdAttribute: 'data-test' });

describe('AppBanner', () => {
  it('Should show popover with details when clicked upon', async () => {
    act(() => {
      render(<AppBanner />);
    });
    fireEvent.click(
      screen.getByRole('button', {
        name: /development preview/i,
      }),
    );
    await screen.findByTestId('dev-preview-banner-popover');
  });
});
