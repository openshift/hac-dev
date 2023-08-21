import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { CloseImportFormModal } from '../CloseImportFormModal';

const closeMock = jest.fn();

describe('CloseImportFormModal', () => {
  let closeReason: boolean;
  beforeEach(() => {
    closeReason = false;
    closeMock.mockImplementation((event, { leave }) => (closeReason = leave === true));
  });

  it('should render CloseImportFormModal', () => {
    render(<CloseImportFormModal onClose={closeMock} />);
    screen.getByText('Your changes will be lost.');
  });

  it('should call closeMock', () => {
    render(<CloseImportFormModal onClose={closeMock} />);
    fireEvent.click(screen.getByText('Leave'));
    expect(closeReason).toEqual(true);
    fireEvent.click(screen.getByText('Cancel'));
    expect(closeReason).toEqual(false);
  });
});
