import * as React from 'react';
import { Button } from '@patternfly/react-core';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createModalLauncher } from '../createModalLauncher';
import { useModalLauncher, ModalProvider } from '../ModalProvider';

describe('Modal Provider', () => {
  it('should launch modal on button click', async () => {
    const launchMyModal = createModalLauncher(() => <div>My Modal</div>, {
      'data-testid': 'my-modal',
    });
    const TestComponent = () => {
      const showModal = useModalLauncher();
      return (
        <Button data-testid="show-modal-button" onClick={() => showModal(launchMyModal())}>
          Show Modal
        </Button>
      );
    };
    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>,
    );
    expect(screen.queryByTestId('my-modal')).toBeNull();
    const btn = screen.queryByTestId('show-modal-button');
    fireEvent.click(btn);
    await waitFor(() => {
      expect(screen.getByTestId('my-modal').textContent).toEqual('My Modal');
      const button = screen.getAllByRole('button');
      fireEvent.click(button[1]);
    });
  });
});
