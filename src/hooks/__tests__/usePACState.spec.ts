import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ComponentKind } from '../../types';
import { PAC_ANNOTATION, SAMPLE_ANNOTATION } from '../../utils/component-utils';
import usePACState, { PACState } from '../usePACState';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(() => [[], true]),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;

const createComponent = (pacValue?: 'done' | 'request'): ComponentKind =>
  ({
    metadata: {
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
    expect(usePACState(component)).toBe(PACState.sample);
  });

  it('should identify disabled state', () => {
    const component = createComponent(undefined);
    expect(usePACState(component)).toBe(PACState.disabled);
  });

  it('should identify requested state', () => {
    const component = createComponent('request');
    expect(usePACState(component)).toBe(PACState.requested);
  });

  it('should identify pending state', () => {
    useK8sWatchResourceMock.mockReturnValueOnce([[], true]);
    const component = createComponent('done');
    expect(usePACState(component)).toBe(PACState.pending);
  });

  it('should identify ready state', () => {
    useK8sWatchResourceMock.mockReturnValueOnce([[{}], true]);
    const component = createComponent('done');
    expect(usePACState(component)).toBe(PACState.ready);
  });

  it('should identify loading state', () => {
    useK8sWatchResourceMock.mockReturnValueOnce([[], false]);
    const component = createComponent('done');
    expect(usePACState(component)).toBe(PACState.loading);
  });
});
