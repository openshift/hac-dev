import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as dateTime from '../datetime';
import { Timestamp } from '../Timestamp';

describe('Timestamp', () => {
  it('renders - when the timestamp is invalid', () => {
    const { getByText } = render(<Timestamp timestamp="xyz" />);
    expect(getByText('-')).toBeInTheDocument();
  });

  it('renders correct timestamp when valid string is passed', () => {
    const expectedDate = dateTime.dateTimeFormatter.format(new Date('2022-02-03T19:34:28Z'));
    const { getByText } = render(<Timestamp timestamp="2022-02-03T19:34:28Z" />);
    expect(getByText(expectedDate.toString())).toBeInTheDocument();
  });
});
