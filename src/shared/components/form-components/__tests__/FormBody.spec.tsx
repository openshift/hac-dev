import * as React from 'react';
import { configure, render, screen } from '@testing-library/react';
import FormBody from '../FormBody';
import '@testing-library/jest-dom';

configure({ testIdAttribute: 'data-test' });

describe('FormBody', () => {
  it('should render children', () => {
    render(
      <FormBody>
        <span data-test="flex-children">children</span>
      </FormBody>,
    );
    expect(screen.getByTestId('flex-children')).toBeInTheDocument();
  });

  it('should render children in flex layout if it is enabled', () => {
    render(
      <FormBody flexLayout data-test="flex-parent">
        <span data-test="flex-children">children</span>
      </FormBody>,
    );
    const element = screen.getByTestId('flex-parent');
    expect(element).toHaveStyle({ display: 'flex' });
  });

  it('should render children without classname for pane body if it is disabled', () => {
    render(
      <FormBody disablePaneBody data-test="flex-parent">
        <span data-test="flex-children">children</span>
      </FormBody>,
    );
    const element = screen.getByTestId('flex-parent');
    expect(element).not.toHaveClass('pane-body');
  });
});
