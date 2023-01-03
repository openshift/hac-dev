import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ActivityTab } from '../ActivityTab';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: () => [[], false],
}));

describe('Activity Tab', () => {
  it('should render Activity Tab', () => {
    render(<ActivityTab applicationName="abcd" />);
    screen.getByText('Activity By');
  });

  it('should render two tabs under activity', () => {
    render(<ActivityTab applicationName="abcd" />);
    screen.getByText('Latest commits');
    screen.getByText('Pipeline runs');
  });
});
