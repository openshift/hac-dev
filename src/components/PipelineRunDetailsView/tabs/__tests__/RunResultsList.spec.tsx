import * as React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import RunResultsList from '../RunResultsList';

describe('RunResultsList', () => {
  it('should render empty state', () => {
    const renderResult = render(<RunResultsList results={[]} status="Failed" />);
    const element = renderResult.getByText('No results available due to failure');
    expect(element).toBeInTheDocument();
  });

  it('should not render empty state', () => {
    const renderResult = render(<RunResultsList results={[]} status="Success" />);
    const element = renderResult.queryByText('No results available due to failure');
    expect(element).toBeNull();
  });

  it('should render results', () => {
    const renderResult = render(
      <RunResultsList results={[{ name: 'test', value: 'result' }]} status="Success" />,
    );
    expect(renderResult.getByText('test')).toBeInTheDocument();
    expect(renderResult.getByText('result')).toBeInTheDocument();
  });
});
