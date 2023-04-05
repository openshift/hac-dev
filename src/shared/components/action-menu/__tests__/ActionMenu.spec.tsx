import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ActionMenu from '../ActionMenu';

describe('Action Menu', () => {
  it('should render the actions when clicked on the kebab menu', async () => {
    render(
      <BrowserRouter>
        <ActionMenu
          actions={[
            {
              cta: () => {},
              id: 'action-1',
              label: 'Action 1',
            },
            {
              cta: () => {},
              id: 'action-2',
              label: 'Action 2',
            },
          ]}
        />
      </BrowserRouter>,
    );
    expect(screen.queryByTestId('Action 1')).toBeNull();
    expect(screen.queryByTestId('Action 2')).toBeNull();
    fireEvent.click(screen.getByTestId('kebab-button'));
    await waitFor(() => {
      expect(screen.getByTestId('Action 1').textContent).toBe('Action 1');
      expect(screen.getByTestId('Action 2').textContent).toBe('Action 2');
    });
  });

  it('should close the open menu when clicked on kebab menu', async () => {
    render(
      <BrowserRouter>
        <ActionMenu
          actions={[
            {
              cta: () => {},
              id: 'action-1',
              label: 'Action 1',
            },
            {
              cta: () => {},
              id: 'action-2',
              label: 'Action 2',
            },
          ]}
        />
      </BrowserRouter>,
    );
    fireEvent.click(screen.getByTestId('kebab-button'));
    fireEvent.click(screen.getByTestId('kebab-button'));

    await waitFor(() => {
      expect(screen.queryByText('Action 1')).toBeNull();
      expect(screen.queryByText('Action 2')).toBeNull();
    });
  });

  it('should close the open menu on clicking outside the menu', async () => {
    render(
      <BrowserRouter>
        <ActionMenu
          actions={[
            {
              cta: () => {},
              id: 'action-1',
              label: 'Action 1',
            },
            {
              cta: () => {},
              id: 'action-2',
              label: 'Action 2',
            },
          ]}
        />
      </BrowserRouter>,
    );
    fireEvent.click(screen.getByTestId('kebab-button'));
    fireEvent.click(document.body);

    await waitFor(() => {
      expect(screen.queryByText('Action 1')).toBeNull();
      expect(screen.queryByText('Action 2')).toBeNull();
    });
  });
});
