import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react-hooks';
import { useTRPipelineRuns } from '../../hooks/useTektonResults';
import { ComponentKind } from '../../types';
import { PACProvision, PAC_ANNOTATION, SAMPLE_ANNOTATION } from '../../utils/component-utils';
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

const createComponent = (pacValue?: PACProvision): ComponentKind =>
  ({
    metadata: {
      namespace: 'test-ns',
      name: 'my-component',
      annotations: {
        [PAC_ANNOTATION]: pacValue,
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

  it('should identify requested state', () => {
    const component = createComponent(PACProvision.request);
    expect(renderHook(() => usePACState(component)).result.current).toBe(PACState.requested);
  });

  it('should identify pending state', () => {
    useK8sWatchResourceMock.mockReturnValueOnce([[], true]);
    const component = createComponent(PACProvision.done);
    expect(renderHook(() => usePACState(component)).result.current).toBe(PACState.pending);
  });

  it('should identify ready state', () => {
    useK8sWatchResourceMock.mockReturnValueOnce([[{ metadata: { name: 'test' } }], true]);
    const component = createComponent(PACProvision.done);
    expect(renderHook(() => usePACState(component)).result.current).toBe(PACState.ready);
  });

  it('should identify error state', () => {
    useK8sWatchResourceMock.mockReturnValueOnce([[], false]);
    const component = createComponent(PACProvision.error);
    expect(renderHook(() => usePACState(component)).result.current).toBe(PACState.error);
  });

  it('should identify loading state', () => {
    useK8sWatchResourceMock.mockReturnValueOnce([[], false]);
    useTRPipelineRunsMock.mockReturnValueOnce([[], false]);
    const component = createComponent(PACProvision.done);
    expect(renderHook(() => usePACState(component)).result.current).toBe(PACState.loading);
  });
});
