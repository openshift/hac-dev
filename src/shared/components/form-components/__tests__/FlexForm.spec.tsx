import * as React from 'react';
import { render, screen } from '@testing-library/react';
import FlexForm from '../FlexForm';
import '@testing-library/jest-dom';

describe('FlexForm', () => {
  it('should render children', () => {
    render(
      <FlexForm>
        <span data-testid="flex-children">children</span>
      </FlexForm>,
    );
    expect(screen.getByTestId('flex-children')).toBeInTheDocument();
  });
});
