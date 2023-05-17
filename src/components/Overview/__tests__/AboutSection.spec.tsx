import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AboutSection from '../AboutSection';

describe('About section', () => {
  it('should render everything correctly in about section', () => {
    render(<AboutSection />);
    screen.getByText('About');
    screen.getByText('Related technologies');
    screen.getByText('Contact us');
  });

  it('should render the links correctly in about section', () => {
    render(<AboutSection />);
    expect(screen.getByRole('link', { name: 'SLSA Level 3' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'https://dn.dev/DevNationSlack' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '#software-supply-chain-security' }),
    ).toBeInTheDocument();
  });
});
