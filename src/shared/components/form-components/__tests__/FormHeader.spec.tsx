import * as React from 'react';
import { configure, render, screen } from '@testing-library/react';
import FormHeader from '../FormHeader';
import '@testing-library/jest-dom';

const title = 'Form header title';
const helpText = 'Form header help text';
const props = { title, helpText };

configure({ testIdAttribute: 'data-test' });

describe('FormHeader', () => {
  it('should show title and helpText', () => {
    render(<FormHeader {...props} />);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(helpText)).toBeInTheDocument();
  });
});
