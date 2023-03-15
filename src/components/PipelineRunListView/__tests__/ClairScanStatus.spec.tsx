import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useClairScanResults } from '../../../hooks/useClairScanResults';
import { ClairScanStatus } from '../ClairScanStatus';

jest.mock('../../../hooks/useClairScanResults', () => ({
  useClairScanResults: jest.fn(),
}));

const mockScanResults = useClairScanResults as jest.Mock;

describe('ClairScanStatus', () => {
  it('shows loading indicator if results are not fetchec', () => {
    mockScanResults.mockReturnValue([null, false]);
    const { container } = render(<ClairScanStatus pipelineRunName="test" />);
    expect(container).toHaveTextContent('Loading Vulnerability Scan status');
  });

  it('shows empty state if results are not available', () => {
    mockScanResults.mockReturnValue([null, true]);
    const { container } = render(<ClairScanStatus pipelineRunName="test" />);
    expect(container).toHaveTextContent('-');
  });

  it('shows scan results after values are fetched', () => {
    mockScanResults.mockReturnValue([
      { vulnerabilities: { critical: 1, high: 2, medium: 3, low: 4 } },
      true,
    ]);
    const { container } = render(<ClairScanStatus pipelineRunName="test" />);
    expect(container).toHaveTextContent('Critical 1');
    expect(container).toHaveTextContent('High 2');
    expect(container).toHaveTextContent('Medium 3');
    expect(container).toHaveTextContent('Low 4');
  });
});
