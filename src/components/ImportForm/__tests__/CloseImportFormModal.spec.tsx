import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { CloseImportFormModal } from '../CloseImportFormModal';

describe('CloseImportFormModal', () => {
  let closeMock;
  beforeEach(() => {
    closeMock = jest.fn();
  });

  it('should render CloseImportFormModal', () => {
    render(<CloseImportFormModal onClose={closeMock} />);
    screen.getByText('Your changes will be lost.');
  });

  it('should call closeMock', () => {
    render(<CloseImportFormModal onClose={closeMock} />);
    fireEvent.click(screen.getByText('Leave'));
    expect(closeMock).toHaveBeenCalledWith({ leave: true });
    fireEvent.click(screen.getByText('Cancel'));
    expect(closeMock).toHaveBeenCalledWith({});
  });
});
