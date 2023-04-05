import * as React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import GitRepoLink from '../GitRepoLink';

describe('GitRepoLink', () => {
  it('should render git owner/name', () => {
    const result = render(<GitRepoLink url="https://github.com/myorg/myproject" />);
    expect(result.baseElement).toHaveTextContent('myorg/myproject');
    expect(result.baseElement).not.toHaveTextContent('https://github.com');
  });

  it('should render git icon', () => {
    const result = render(<GitRepoLink url="https://bitbucket.org/myorg/myproject" />);
    expect(result.baseElement.querySelector('svg').getAttribute('alt')).toBe('Bitbucket');
  });
});
