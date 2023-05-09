import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ScanStatus } from '../ScanStatus';

describe('ScanStatus', () => {
  it('shows loading indicator if results are not fetched', () => {
    const { container } = render(<ScanStatus scanResults={undefined} />);
    expect(container).toHaveTextContent('Loading Vulnerability Scan status');
  });

  it('shows empty state if results are not available', () => {
    const { container } = render(<ScanStatus scanResults={null} />);
    expect(container).toHaveTextContent('-');
  });

  it('shows scan results after values are fetched', () => {
    render(
      <ScanStatus scanResults={{ vulnerabilities: { critical: 1, high: 2, medium: 3, low: 4 } }} />,
    );
    expect(screen.getByTestId('scan-status-critical-test-id')).toHaveTextContent('Critical1');
    expect(screen.getByTestId('scan-status-high-test-id')).toHaveTextContent('High2');
    expect(screen.getByTestId('scan-status-medium-test-id')).toHaveTextContent('Medium3');
    expect(screen.getByTestId('scan-status-low-test-id')).toHaveTextContent('Low4');
  });
});
