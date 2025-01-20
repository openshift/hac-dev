import { k8sPatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react-hooks';
import { useApplicationPipelineGitHubApp } from '../../hooks/useApplicationPipelineGitHubApp';
import { ComponentModel } from '../../models';
import { ComponentKind } from '../../types';
import {
  isPACEnabled,
  useURLForComponentPRs,
  useComponentBuildStatus,
  BUILD_STATUS_ANNOTATION,
  startNewBuild,
  BUILD_REQUEST_ANNOTATION,
  BuildRequest,
  getLastestImage,
} from '../component-utils';

jest.mock('../../hooks/useApplicationPipelineGitHubApp', () => ({
  useApplicationPipelineGitHubApp: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  k8sPatchResource: jest.fn(),
}));

const useApplicationPipelineGitHubAppMock = useApplicationPipelineGitHubApp as jest.Mock;

const k8sPatchResourceMock = k8sPatchResource as jest.Mock;

describe('component-utils', () => {
  it('should detect pac enabled state', () => {
    const createComponent = (buildState: string | undefined): ComponentKind => {
      const result = {
        metadata: {
          annotations: {
            [BUILD_STATUS_ANNOTATION]: buildState && JSON.stringify({ pac: { state: buildState } }),
          },
        },
      };
      return (result ?? {}) as ComponentKind;
    };
    expect(isPACEnabled(createComponent(undefined))).toBe(false);
    expect(isPACEnabled(createComponent('enabled'))).toBe(true);
    expect(isPACEnabled(createComponent('disabled'))).toBe(false);
  });

  it('should start a new PAC build when PAC is enabled', () => {
    const createComponent = (buildState: string | undefined): ComponentKind => {
      const result = {
        metadata: {
          annotations: {
            [BUILD_STATUS_ANNOTATION]: buildState && JSON.stringify({ pac: { state: buildState } }),
          },
        },
      };
      return (result ?? {}) as ComponentKind;
    };

    const component = createComponent('enabled');
    startNewBuild(component);

    expect(k8sPatchResourceMock).toHaveBeenCalledWith({
      model: ComponentModel,
      queryOptions: {
        name: component.metadata.name,
        ns: component.metadata.namespace,
      },
      patches: [
        {
          op: 'add',
          path: `/metadata/annotations/${BUILD_REQUEST_ANNOTATION.replace('/', '~1')}`,
          value: BuildRequest.triggerPACBuild,
        },
      ],
    });
  });

  it('should start a new simple build when PAC is not enabled', () => {
    const createComponent = (buildState: string | undefined): ComponentKind => {
      const result = {
        metadata: {
          annotations: {
            [BUILD_STATUS_ANNOTATION]: buildState && JSON.stringify({ pac: { state: buildState } }),
          },
        },
      };
      return (result ?? {}) as ComponentKind;
    };

    const component = createComponent('disabled');
    startNewBuild(component);

    expect(k8sPatchResourceMock).toHaveBeenCalledWith({
      model: ComponentModel,
      queryOptions: {
        name: component.metadata.name,
        ns: component.metadata.namespace,
      },
      patches: [
        {
          op: 'add',
          path: `/metadata/annotations/${BUILD_REQUEST_ANNOTATION.replace('/', '~1')}`,
          value: BuildRequest.triggerSimpleBuild,
        },
      ],
    });
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
            [BUILD_STATUS_ANNOTATION]: pacEnabled && JSON.stringify({ pac: { state: 'enabled' } }),
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
  it('should return status.lastPromotedImage when lastPromotedImage is available', () => {
    const mockComponent = {
      status: {
        lastPromotedImage: 'test-url',
      },
    } as unknown as ComponentKind;

    expect(getLastestImage(mockComponent)).toEqual('test-url');
  });

  it('should return spec.containerImage when lastPromotedImage is unavailable', () => {
    const mockComponent = {
      spec: {
        containerImage: 'test-url',
      },
    } as unknown as ComponentKind;

    expect(getLastestImage(mockComponent)).toEqual('test-url');
  });

  it('should return status.lastPromotedImage when lastPromotedImage and containerImage are both available', () => {
    const mockComponent = {
      spec: {
        containerImage: 'test-url',
      },
      status: {
        lastPromotedImage: 'test-url-promoted',
      },
    } as unknown as ComponentKind;

    expect(getLastestImage(mockComponent)).toEqual('test-url-promoted');
  });
});
