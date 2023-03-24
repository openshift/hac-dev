import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { getGitIcon } from '../git-utils';

describe('git-utils', () => {
  it('should return GitHub icon', () => {
    const result = render(getGitIcon('github.com'));
    expect(result.baseElement.querySelector('svg').getAttribute('alt')).toBe('GitHub');
  });

  it('should return Bitbucket icon', () => {
    const result = render(getGitIcon('bitbucket.org'));
    expect(result.baseElement.querySelector('svg').getAttribute('alt')).toBe('Bitbucket');
  });

  it('should return Gitlab icon', () => {
    const result = render(getGitIcon('gitlab.com'));
    expect(result.baseElement.querySelector('svg').getAttribute('alt')).toBe('Gitlab');
  });

  it('should return Git icon', () => {
    const result = render(getGitIcon('customrepo.com'));
    expect(result.baseElement.querySelector('svg').getAttribute('alt')).toBe('Git');
  });
});
