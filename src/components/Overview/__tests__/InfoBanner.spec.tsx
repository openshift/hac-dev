import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InfoBanner from '../InfoBanner';

describe('Info banner', () => {
  it('should render everything correctly in info banner', () => {
    render(<InfoBanner />);
    screen.getByText('Build artifacts of all kinds from source');
    screen.getByText("Rapidly improve the security of your application's software supply chain");
    screen.getByText('Catch critical vulnerabilities quickly');
  });
});
