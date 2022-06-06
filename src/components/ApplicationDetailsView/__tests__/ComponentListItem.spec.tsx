import * as React from 'react';
import { configure, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { componentCRMocks } from '../__data__/mock-data';
import { ComponentListItem } from '../ComponentListItem';

configure({ testIdAttribute: 'data-testId' });

describe('ComponentListItem', () => {
  it('should render display name of the component', () => {
    render(<ComponentListItem component={componentCRMocks[0]} routes={[]} />);
    screen.getByText('basic-node-js');
  });

  it('should render View Build logs action item', async () => {
    render(<ComponentListItem component={componentCRMocks[0]} routes={[]} />);
    const kebabButton = screen.getByTestId('kebab-button');
    fireEvent.click(kebabButton);
    await waitFor(() => screen.getByText('View Build Logs'));
  });

  it('should render Component settings action item', async () => {
    render(<ComponentListItem component={componentCRMocks[0]} routes={[]} />);
    const kebabButton = screen.getByTestId('kebab-button');
    fireEvent.click(kebabButton);
    await waitFor(() => screen.getByText('Component settings'));
  });
});
