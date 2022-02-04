import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Timestamp } from '../Timestamp';

describe('Timestamp', () => {
  it('should render - if timestamp is invalid', () => {
    expect(render(<Timestamp timestamp={'xyz'} />).getByText('-')).toBeInTheDocument();
  });
  it('should render proper content if timestamp is valid', () => {
    const { container } = render(<Timestamp timestamp={'2022-02-03T19:34:28Z'} />);
    expect(container).toHaveTextContent('Feb 4, 2022, 1:04 AM');
  });
});
