import { renderHook } from '@testing-library/react-hooks';
import { useApplicationPipelineGitHubApp } from '../../hooks/useApplicationPipelineGitHubApp';
import { ComponentKind } from '../../types';
import {
  isPACEnabled,
  PAC_ANNOTATION,
  useURLForComponentPRs,
  useComponentBuildStatus,
  BUILD_STATUS_ANNOTATION,
} from '../component-utils';

jest.mock('../../hooks/useApplicationPipelineGitHubApp', () => ({
  useApplicationPipelineGitHubApp: jest.fn(),
}));

const useApplicationPipelineGitHubAppMock = useApplicationPipelineGitHubApp as jest.Mock;

describe('component-utils', () => {
  it('should detect pac enabled state', () => {
    const createComponent = (pacValue: string | undefined): ComponentKind => {
      let result: any;
      if (pacValue) {
        result = {
          metadata: {
            annotations: {
              [PAC_ANNOTATION]: pacValue,
            },
          },
        };
      }
      return (result ?? {}) as ComponentKind;
    };
    expect(isPACEnabled(createComponent(undefined))).toBe(false);
    expect(isPACEnabled(createComponent('request'))).toBe(true);
    expect(isPACEnabled(createComponent('request'), true)).toBe(false);
    expect(isPACEnabled(createComponent('done'), false)).toBe(true);
    expect(isPACEnabled(createComponent('done'), true)).toBe(true);
  });

  it('should create github URL for component PRs', () => {
    useApplicationPipelineGitHubAppMock.mockReturnValue({
      name: 'appstudio-staging-ci',
      url: 'https://github.com/apps/appstudio-staging-ci.git',
    });
    const createComponent = (url: string, pacEnabled = true): ComponentKind =>
      ({
        metadata: {
          annotations: {
            [PAC_ANNOTATION]: pacEnabled ? 'done' : '',
          },
        },
        spec: {
          source: {
            git: {
              url,
            },
          },
        },
      } as any as ComponentKind);

    expect(renderHook(() => useURLForComponentPRs([])).result.current).toBe(
      'https://github.com/pulls?q=is:pr+is:open+author:app/appstudio-staging-ci',
    );
    expect(
      renderHook(() =>
        useURLForComponentPRs([
          createComponent('test', false),
          createComponent('https://github.com/org/repo', false),
        ]),
      ).result.current,
    ).toBe('https://github.com/pulls?q=is:pr+is:open+author:app/appstudio-staging-ci');
    expect(
      renderHook(() =>
        useURLForComponentPRs([
          createComponent('test', true),
          createComponent('https://github.com/org/repo1', true),
          createComponent('https://github.com/org/repo2', true),
        ]),
      ).result.current,
    ).toBe(
      'https://github.com/pulls?q=is:pr+is:open+author:app/appstudio-staging-ci+repo:org/repo1+repo:org/repo2',
    );
  });

  it('should provide parsed component build status when available', () => {
    const mockComponent = {
      metadata: {
        annotations: {
          [BUILD_STATUS_ANNOTATION]:
            '{"pac":{"state":"enabled","merge-url":"example.com"},"message":"done"}',
        },
      },
    } as any as ComponentKind;

    expect(renderHook(() => useComponentBuildStatus(mockComponent)).result.current).toEqual({
      pac: { state: 'enabled', 'merge-url': 'example.com' },
      message: 'done',
    });
  });
});
