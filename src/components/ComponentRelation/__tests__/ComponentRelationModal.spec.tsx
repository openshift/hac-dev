import * as React from 'react';
import { configure, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { componentCRMocks } from '../../Components/__data__/mock-data';
import { ComponentRelationModal } from '../ComponentRelationModal';
import '@testing-library/jest-dom';

configure({ testIdAttribute: 'id' });

jest.mock('../../../hooks/useComponents', () => ({
  useComponents: jest.fn(() => [[componentCRMocks[0]], true, null]),
  useAllComponents: jest.fn(() => [componentCRMocks, true, null]),
}));

jest.mock('../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'asd', workspace: 'def' })),
}));

jest.mock('../../../utils/analytics', () => ({
  ...jest.requireActual('../../../utils/analytics'),
  useTrackEvent: jest.fn(() => () => {}),
}));

jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  updateNudgeDependencies: jest.fn(() => Promise.resolve([])),
}));

class MockResizeObserver {
  observe() {
    // do nothing
  }

  unobserve() {
    // do nothing
  }

  disconnect() {
    // do nothing
  }
}

window.ResizeObserver = MockResizeObserver;

describe('ComponentRelationModal', () => {
  it('should render modal', () => {
    render(<ComponentRelationModal modalProps={{ isOpen: true }} application="apps" />);
    screen.getByText('Component relationships');
  });

  it('should render dropdowns', () => {
    render(<ComponentRelationModal modalProps={{ isOpen: true }} application="apps" />);
    expect(screen.getAllByTestId('toggle-component-menu')).toHaveLength(2);
  });

  it('should show cancelation modal when clicked on cancel', () => {
    let isOpen = true;
    const onClose = () => {
      isOpen = false;
    };
    const { rerender } = render(
      <ComponentRelationModal modalProps={{ isOpen, onClose }} application="apps" />,
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Your changes will be lost!')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Go back'));
    expect(screen.queryByText('Your changes will be lost!')).not.toBeInTheDocument();
    expect(screen.queryByText('Component relationships')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Your changes will be lost!')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close anyway'));
    rerender(<ComponentRelationModal modalProps={{ isOpen, onClose }} application="apps" />);
    expect(screen.queryByText('Your changes will be lost!')).not.toBeInTheDocument();
  });

  it('should render new relationship on clicking `add another component relationship`', () => {
    render(<ComponentRelationModal modalProps={{ isOpen: true }} application="apps" />);
    screen.getByText('Component relationships');
    expect(screen.getAllByTestId('toggle-component-menu')).toHaveLength(2);
    fireEvent.click(screen.getByText(`Add another component relationship`));
    expect(screen.getAllByTestId('toggle-component-menu')).toHaveLength(4);
  });

  it('should show confirmation modal on relationship save', async () => {
    let isOpen = true;
    const onClose = () => {
      isOpen = false;
    };
    render(<ComponentRelationModal modalProps={{ isOpen, onClose }} application="apps" />);
    expect(screen.queryByText('Component relationships')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('nudged-by-0'));
    const saveButton = screen.getByText('Save relationships');
    expect(saveButton.getAttribute('class')).not.toContain('pf-m-disabled');
    fireEvent.click(saveButton);
    await expect(saveButton.getAttribute('class')).toContain('pf-m-in-progress');
    await waitFor(() => expect(saveButton.getAttribute('class')).not.toContain('pf-m-in-progress'));
  });
});
