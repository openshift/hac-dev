import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react-hooks';
import { useTRPipelineRuns } from '../../hooks/useTektonResults';
import { ComponentKind } from '../../types';
import {
  BUILD_REQUEST_ANNOTATION,
  BUILD_STATUS_ANNOTATION,
  ComponentBuildState,
  SAMPLE_ANNOTATION,
} from '../../utils/component-utils';
import usePACState, { PACState } from '../usePACState';

jest.mock('../../hooks/useTektonResults');

jest.mock('../../hooks/useApplicationPipelineGitHubApp', () => ({
  useApplicationPipelineGitHubApp: jest.fn(() => ({
    name: 'test-app',
    url: 'https://github.com/test-app',
  })),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(() => [[], true]),
  getActiveWorkspace: jest.fn(),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;
const useTRPipelineRunsMock = useTRPipelineRuns as jest.Mock;

const createComponent = (buildState?: ComponentBuildState): ComponentKind =>
  ({
    metadata: {
      namespace: 'test-ns',
      name: 'my-component',
      annotations: {
        [BUILD_STATUS_ANNOTATION]:
          buildState &&
          JSON.stringify({
            pac: { state: buildState, 'configuration-time': 'Wed, 21 Jul 2023 19:36:25 UTC' },
          }),
      },
    },
    spec: {
      source: {
        git: {
          url: 'https://github.com/org/test',
        },
      },
    },
  } as any as ComponentKind);

describe('usePACState', () => {
  it('should identify sample state', () => {
    const component = createComponent(undefined);
    component.metadata.annotations[SAMPLE_ANNOTATION] = 'true';
    expect(renderHook(() => usePACState(component)).result.current).toBe(PACState.sample);
  });

  it('should identify disabled state', () => {
    const component = createComponent(undefined);
    expect(renderHook(() => usePACState(component)).result.current).toBe(PACState.disabled);
  });

  it('should identify confiure requested state', () => {
    const component = createComponent(undefined);
    component.metadata.annotations[BUILD_REQUEST_ANNOTATION] = 'configure-pac';
    expect(renderHook(() => usePACState(component)).result.current).toBe(
      PACState.configureRequested,
    );
  });

  it('should identify unconfiure requested state', () => {
    const component = createComponent(undefined);
    component.metadata.annotations[BUILD_REQUEST_ANNOTATION] = 'unconfigure-pac';
    expect(renderHook(() => usePACState(component)).result.current).toBe(
      PACState.unconfigureRequested,
    );
  });

  it('should identify pending state', () => {
    useK8sWatchResourceMock.mockReturnValueOnce([[], true]);
    const component = createComponent(ComponentBuildState.enabled);
    expect(renderHook(() => usePACState(component)).result.current).toBe(PACState.pending);
  });

  it('should identify ready state', () => {
    useK8sWatchResourceMock.mockReturnValueOnce([
      [{ metadata: { name: 'test', creationTimestamp: '2023-07-25T00:00:00Z' } }],
      true,
    ]);
    const component = createComponent(ComponentBuildState.enabled);
    expect(renderHook(() => usePACState(component)).result.current).toBe(PACState.ready);
  });

  it('should identify pending state through correct bulid pipeline runs', () => {
    useK8sWatchResourceMock.mockReturnValueOnce([
      [{ metadata: { name: 'test', creationTimestamp: '2023-01-20T00:00:00Z' } }],
      true,
    ]);
    const component = createComponent(ComponentBuildState.enabled);
    expect(renderHook(() => usePACState(component)).result.current).toBe(PACState.pending);
  });

  it('should identify error state', () => {
    useK8sWatchResourceMock.mockReturnValueOnce([[], false]);
    const component = createComponent(ComponentBuildState.error);
    expect(renderHook(() => usePACState(component)).result.current).toBe(PACState.error);
  });

  it('should identify loading state', () => {
    useK8sWatchResourceMock.mockReturnValueOnce([[], false]);
    useTRPipelineRunsMock.mockReturnValueOnce([[], false]);
    const component = createComponent(ComponentBuildState.enabled);
    expect(renderHook(() => usePACState(component)).result.current).toBe(PACState.loading);
  });
});
