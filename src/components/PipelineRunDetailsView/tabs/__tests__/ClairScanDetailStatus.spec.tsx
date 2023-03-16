import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ClairScanDetailStatus } from '../ClairScanDetailStatus';

describe('ClairScanDetailStatus', () => {
  it('should show scan results', () => {
    const { container } = render(
      <ClairScanDetailStatus
        scanResults={{ vulnerabilities: { critical: 1, high: 2, medium: 3, low: 4 } }}
      />,
    );
    expect(container).toHaveTextContent('Critical 1');
    expect(container).toHaveTextContent('High 2');
    expect(container).toHaveTextContent('Medium 3');
    expect(container).toHaveTextContent('Low 4');
  });
});
