import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InfoBanner from '../InfoBanner';

describe('Info banner', () => {
  it('should render everything correctly in info banner', () => {
    render(<InfoBanner />);
    screen.getByText(
      'Start with source code and containerize your applications for OpenShift and Kubernetes',
    );
    screen.getByText("Rapidly improve the security of your application's software supply chain");
    screen.getByText(
      'Execute integration tests for complex applications and see results in your SCM',
    );
  });
});
