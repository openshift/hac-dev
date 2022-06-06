import * as React from 'react';
import { configure, render, screen } from '@testing-library/react';
import PageBody from '../PageBody';
import '@testing-library/jest-dom';

configure({ testIdAttribute: 'data-test' });

describe('FlexForm', () => {
  it('should render children', () => {
    render(
      <PageBody>
        <span data-test="flex-children">children</span>
      </PageBody>,
    );
    expect(screen.getByTestId('flex-children')).toBeInTheDocument();
  });

  it('should not render with classname for flex layout if flexLayout is false', () => {
    render(
      <PageBody flexLayout={false}>
        <span>children</span>
      </PageBody>,
    );
    const element = screen.getByTestId('page-body');
    expect(element).not.toHaveClass('page-body');
  });

  it('should render with classname for flex layout if flexLayout is true', () => {
    render(
      <PageBody flexLayout>
        <span>children</span>
      </PageBody>,
    );
    const element = screen.getByTestId('page-body');
    expect(element).toHaveClass('page-body');
  });
});
