import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { getGitIcon, getGitPath } from '../git-utils';

describe('git-utils', () => {
  describe('getGitIcon', () => {
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

  describe('getGitPath', () => {
    it('should return GitHub path', () => {
      const result = getGitPath('github.com', 'org', 'test');
      expect(result).toBe('/tree/org/test');
    });

    it('should return Bitbucket path', () => {
      const result = getGitPath('bitbucket.org', 'org', 'test');
      expect(result).toBe('/branch/org/test');
    });

    it('should return Gitlab path', () => {
      const result = getGitPath('gitlab.com', 'org', 'test');
      expect(result).toBe('/-/tree/org/test');
    });

    it('should return empty Git path for unknown source', () => {
      const result = getGitPath('customrepo.com', 'org', 'test');
      expect(result).toBe('');
    });

    it('should return empty Git path when no revision is provided', () => {
      const result = getGitPath('customrepo.com', '', 'test');
      expect(result).toBe('');
    });

    it('should return correct path for self hosted gitlab internal instance', () => {
      const result = getGitPath('customrepo.com', 'org', 'test', 'gitlab.cee.redhat.com');
      expect(result).toBe('/-/tree/org/test');
    });

    it('should return correct path for self hosted instance', () => {
      const result = getGitPath('customrepo.com', 'org', 'test', 'gitlab.abcd.org.com');
      expect(result).toBe('');
    });
  });
});
