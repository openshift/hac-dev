import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ScanDetailStatus } from '../ScanDetailStatus';

describe('ScanDetailStatus', () => {
  it('should show scan results', () => {
    render(
      <ScanDetailStatus
        scanResults={{ vulnerabilities: { critical: 1, high: 2, medium: 3, low: 4 } }}
      />,
    );
    expect(screen.getByTestId('scan-status-critical-test-id')).toHaveTextContent('Critical1');
    expect(screen.getByTestId('scan-status-high-test-id')).toHaveTextContent('High2');
    expect(screen.getByTestId('scan-status-medium-test-id')).toHaveTextContent('Medium3');
    expect(screen.getByTestId('scan-status-low-test-id')).toHaveTextContent('Low4');
  });
});
