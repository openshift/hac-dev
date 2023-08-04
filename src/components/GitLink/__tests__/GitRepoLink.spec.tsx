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

  it('should render revision if available', () => {
    const result = render(<GitRepoLink url="https://github.com/myorg/myproject" revision="main" />);
    expect(result.baseElement).toHaveTextContent('(main)');
  });

  it('should render context dir if available', () => {
    const result = render(<GitRepoLink url="https://github.com/myorg/myproject" context="./src" />);
    expect(result.baseElement).toHaveTextContent('(src)');
  });

  it('should strip leading "/" from context', () => {
    const result = render(<GitRepoLink url="https://github.com/myorg/myproject" context="/src" />);
    expect(result.baseElement).toHaveTextContent('(src)');
  });

  it('should strip leading "./" from context', () => {
    const result = render(<GitRepoLink url="https://github.com/myorg/myproject" context="./src" />);
    expect(result.baseElement).toHaveTextContent('(src)');
  });

  it('should not strip leading "." from context', () => {
    const result = render(
      <GitRepoLink url="https://github.com/myorg/myproject" context=".hidden_dir" />,
    );
    expect(result.baseElement).toHaveTextContent('(.hidden_dir)');
  });
});
