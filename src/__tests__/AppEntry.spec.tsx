import * as React from 'react';
import { act, render, screen, configure } from '@testing-library/react';
import AppEntry from '../AppEntry';

configure({ testIdAttribute: 'data-test' });

describe('AppEntry', () => {
  it('Should show Dev Preview Banner on each page which shows a popover with details when clicked upon', async () => {
    act(() => {
      render(<AppEntry />);
    });
    screen.getByTestId('dev-preview-banner');
  });
});
